<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AwsController;

Route::get('/health', function () {
    return response()->json([
        'status'    => 'ok',
        'service'   => 'AWS Dashboard API',
        'timestamp' => now()->toISOString(),
    ]);
});

Route::prefix('aws')->group(function () {
    Route::get('/dashboard',      [AwsController::class, 'dashboard']);
    Route::get('/ec2/instances',  [AwsController::class, 'ec2Instances']);
    Route::get('/s3/buckets',     [AwsController::class, 's3Buckets']);
    Route::get('/billing',        [AwsController::class, 'billing']);
    Route::get('/iam/users',      [AwsController::class, 'iamUsers']);
});