<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    public function __construct(private AnalyticsService $analyticsService) {}

    /**
     * Get metrics for specific event
     */
    public function getEventMetrics(Event $event): JsonResponse
    {
        $this->authorize('view', $event);

        $metrics = $this->analyticsService->getEventMetrics($event);

        return response()->json(['data' => $metrics]);
    }

    /**
     * Get venue utilization report
     */
    public function getVenueUtilization(): JsonResponse
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'staff') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $report = $this->analyticsService->getVenueUtilization();

        return response()->json(['data' => $report]);
    }

    /**
     * Get attendance trends
     */
    public function getAttendanceTrends(): JsonResponse
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'staff') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $trends = $this->analyticsService->getAttendanceTrends();

        return response()->json(['data' => $trends]);
    }

    /**
     * Get engagement metrics
     */
    public function getEngagementMetrics(): JsonResponse
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'staff') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $metrics = $this->analyticsService->getEngagementMetrics();

        return response()->json(['data' => $metrics]);
    }

    /**
     * Get comprehensive dashboard report
     */
    public function getDashboardReport(): JsonResponse
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $report = $this->analyticsService->getDashboardReport();

        return response()->json(['data' => $report]);
    }
}
