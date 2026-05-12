<?php

namespace App\Http\Controllers;

use App\Services\AwsService;
use Illuminate\Http\JsonResponse;

class AwsController extends Controller
{
    public function __construct(protected AwsService $aws) {}

    public function ec2Instances(): JsonResponse
    {
        return response()->json($this->aws->getEc2Instances());
    }

    public function s3Buckets(): JsonResponse
    {
        return response()->json($this->aws->getS3Buckets());
    }

    public function billing(): JsonResponse
    {
        return response()->json($this->aws->getBilling());
    }

    public function iamUsers(): JsonResponse
    {
        return response()->json($this->aws->getIamUsers());
    }

    public function dashboard(): JsonResponse
    {
        return response()->json($this->aws->getDashboardSummary());
    }
}