<?php

namespace App\Services;

use Aws\Ec2\Ec2Client;
use Aws\S3\S3Client;
use Aws\CloudWatch\CloudWatchClient;
use Aws\Iam\IamClient;
use Aws\Exception\AwsException;

class AwsService
{
    protected array $config;

    public function __construct()
    {
        $this->config = [
            'version'     => 'latest',
            'region'      => config('aws.region'),
            'credentials' => [
                'key'    => config('aws.key'),
                'secret' => config('aws.secret'),
            ],
        ];
    }

    // EC2 - Get all instances
    public function getEc2Instances(): array
    {
        try {
            $client = new Ec2Client($this->config);
            $result = $client->describeInstances();

            $instances = [];
            foreach ($result['Reservations'] as $reservation) {
                foreach ($reservation['Instances'] as $instance) {
                    $name = '';
                    foreach ($instance['Tags'] ?? [] as $tag) {
                        if ($tag['Key'] === 'Name') {
                            $name = $tag['Value'];
                        }
                    }
                    $instances[] = [
                        'id'          => $instance['InstanceId'],
                        'name'        => $name,
                        'type'        => $instance['InstanceType'],
                        'state'       => $instance['State']['Name'],
                        'public_ip'   => $instance['PublicIpAddress'] ?? null,
                        'private_ip'  => $instance['PrivateIpAddress'] ?? null,
                        'launch_time' => $instance['LaunchTime']->format('Y-m-d H:i:s'),
                        'az'          => $instance['Placement']['AvailabilityZone'],
                    ];
                }
            }

            return ['success' => true, 'data' => $instances, 'count' => count($instances)];

        } catch (AwsException $e) {
            return ['success' => false, 'error' => $e->getAwsErrorMessage()];
        }
    }

    // S3 - Get all buckets
    public function getS3Buckets(): array
    {
        try {
            $client = new S3Client($this->config);
            $result = $client->listBuckets();

            $buckets = array_map(fn($b) => [
                'name'          => $b['Name'],
                'creation_date' => $b['CreationDate']->format('Y-m-d'),
            ], $result['Buckets']);

            return ['success' => true, 'data' => $buckets, 'count' => count($buckets)];

        } catch (AwsException $e) {
            return ['success' => false, 'error' => $e->getAwsErrorMessage()];
        }
    }

    // CloudWatch - Get billing
    public function getBilling(): array
    {
        try {
            $config = array_merge($this->config, ['region' => 'us-east-1']);
            $client = new CloudWatchClient($config);

            $result = $client->getMetricStatistics([
                'Namespace'  => 'AWS/Billing',
                'MetricName' => 'EstimatedCharges',
                'Dimensions' => [
                    ['Name' => 'Currency', 'Value' => 'USD'],
                ],
                'StartTime'  => new \DateTime('-30 days'),
                'EndTime'    => new \DateTime(),
                'Period'     => 86400,
                'Statistics' => ['Maximum'],
            ]);

            $points = array_map(fn($dp) => [
                'date'   => $dp['Timestamp']->format('M d'),
                'amount' => round($dp['Maximum'], 4),
            ], $result['Datapoints']);

            usort($points, fn($a, $b) => strcmp($a['date'], $b['date']));

            return ['success' => true, 'data' => $points];

        } catch (AwsException $e) {
            return ['success' => false, 'error' => $e->getAwsErrorMessage()];
        }
    }

    // IAM - Get all users
    public function getIamUsers(): array
    {
        try {
            $client = new IamClient($this->config);
            $result = $client->listUsers();

            $users = array_map(fn($u) => [
                'username' => $u['UserName'],
                'user_id'  => $u['UserId'],
                'created'  => $u['CreateDate']->format('Y-m-d'),
                'last_login' => isset($u['PasswordLastUsed'])
                    ? $u['PasswordLastUsed']->format('Y-m-d H:i')
                    : 'Never',
            ], $result['Users']);

            return ['success' => true, 'data' => $users, 'count' => count($users)];

        } catch (AwsException $e) {
            return ['success' => false, 'error' => $e->getAwsErrorMessage()];
        }
    }

    // Dashboard summary
    public function getDashboardSummary(): array
    {
        $ec2     = $this->getEc2Instances();
        $s3      = $this->getS3Buckets();
        $iam     = $this->getIamUsers();
        $billing = $this->getBilling();

        $latestBill = 0;
        if ($billing['success'] && !empty($billing['data'])) {
            $latestBill = end($billing['data'])['amount'];
        }

        return [
            'success' => true,
            'data' => [
                'ec2'     => ['total' => $ec2['count'] ?? 0],
                's3'      => ['buckets' => $s3['count'] ?? 0],
                'iam'     => ['users' => $iam['count'] ?? 0],
                'billing' => ['estimated_usd' => $latestBill],
                'region'  => config('aws.region'),
                'fetched_at' => now()->toISOString(),
            ]
        ];
    }
}