<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\AnalyticsController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Auth Routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    // Event Routes
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
    Route::get('/events/{event}', [EventController::class, 'show']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);

    // Event Registration & Management
    Route::post('/events/{event}/register', [EventController::class, 'register']);
    Route::post('/events/{event}/unregister', [EventController::class, 'unregister']);
    Route::get('/events/{event}/attendees', [EventController::class, 'getAttendees']);

    // Event Approval (Staff/Admin)
    Route::post('/events/{event}/approve', [EventController::class, 'approveEvent']);
    Route::post('/events/{event}/reject', [EventController::class, 'rejectEvent']);

    // Schedule Routes (to be implemented)
    Route::get('/student/schedule', 'ScheduleController@getSchedule');
    Route::get('/student/schedule/clashes', 'ScheduleController@checkClashes');
    Route::post('/student/schedule/classes', 'ScheduleController@addClass');

    // Recommendation Routes (to be implemented)
    Route::get('/events/recommended', 'RecommendationController@getRecommendations');

    // Networking Routes (to be implemented)
    Route::get('/events/{event}/study-circles', 'NetworkingController@getStudyCircles');
    Route::post('/study-circles', 'NetworkingController@createStudyCircle');
    Route::post('/study-circles/{id}/join', 'NetworkingController@joinCircle');

    // Q&A Routes (to be implemented)
    Route::post('/events/{event}/questions', 'QAController@submitQuestion');
    Route::get('/events/{event}/questions', 'QAController@getQuestions');
    Route::post('/questions/{id}/vote', 'QAController@voteQuestion');

    // Payment Routes
    Route::get('/payments/event/{event}/checkout-data', [PaymentController::class, 'getCheckoutData']);
    Route::post('/payments/create', [PaymentController::class, 'createPayment']);
    Route::get('/payments/history', [PaymentController::class, 'getHistory']);
    Route::get('/payments/{payment}', [PaymentController::class, 'show']);
    Route::post('/payments/{payment}/confirm', [PaymentController::class, 'confirmPayment']);
    Route::get('/events/{event}/revenue', [PaymentController::class, 'getEventRevenue']);
    Route::get('/admin/payments/stats', [PaymentController::class, 'getStats']);

    // Approval Workflow Routes
    Route::get('/events/{event}/workflow', [ApprovalController::class, 'getWorkflow']);
    Route::post('/approvals/{workflow}/approve', [ApprovalController::class, 'approve']);
    Route::post('/approvals/{workflow}/reject', [ApprovalController::class, 'reject']);
    Route::post('/approvals/{workflow}/revisions', [ApprovalController::class, 'requestRevisions']);
    Route::post('/approvals/{workflow}/feedback', [ApprovalController::class, 'addFeedback']);
    Route::get('/admin/approvals/pending', [ApprovalController::class, 'getPending']);
    Route::get('/admin/approvals/stats', [ApprovalController::class, 'getStats']);

    // Analytics Routes
    Route::get('/events/{event}/analytics', [AnalyticsController::class, 'getEventMetrics']);
    Route::get('/admin/analytics/venue-utilization', [AnalyticsController::class, 'getVenueUtilization']);
    Route::get('/admin/analytics/attendance-trends', [AnalyticsController::class, 'getAttendanceTrends']);
    Route::get('/admin/analytics/engagement', [AnalyticsController::class, 'getEngagementMetrics']);
    Route::get('/admin/analytics/dashboard', [AnalyticsController::class, 'getDashboardReport']);
});
