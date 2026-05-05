<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\ApprovalWorkflow;
use App\Services\ApprovalService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ApprovalController extends Controller
{
    public function __construct(private ApprovalService $approvalService) {}

    /**
     * Get approval workflow for event
     */
    public function getWorkflow(Event $event): JsonResponse
    {
        $workflow = $this->approvalService->getWorkflow($event);

        if (!$workflow) {
            return response()->json(['error' => 'No workflow found'], 404);
        }

        return response()->json([
            'data' => $workflow->load('feedback', 'reviewer'),
        ]);
    }

    /**
     * Approve event
     */
    public function approve(Request $request, ApprovalWorkflow $workflow): JsonResponse
    {
        $this->authorize('update', $workflow);

        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        $this->approvalService->approveEvent($workflow, auth()->user(), $validated['notes'] ?? '');

        return response()->json([
            'message' => 'Event approved',
            'workflow' => $workflow->fresh()->load('feedback'),
        ]);
    }

    /**
     * Reject event
     */
    public function reject(Request $request, ApprovalWorkflow $workflow): JsonResponse
    {
        $this->authorize('update', $workflow);

        $validated = $request->validate([
            'notes' => 'required|string',
        ]);

        $this->approvalService->rejectEvent($workflow, auth()->user(), $validated['notes']);

        return response()->json([
            'message' => 'Event rejected',
            'workflow' => $workflow->fresh()->load('feedback'),
        ]);
    }

    /**
     * Request revisions
     */
    public function requestRevisions(Request $request, ApprovalWorkflow $workflow): JsonResponse
    {
        $this->authorize('update', $workflow);

        $validated = $request->validate([
            'reason' => 'required|string',
            'items' => 'required|array',
        ]);

        $this->approvalService->requestRevisions(
            $workflow,
            auth()->user(),
            $validated['reason'],
            $validated['items']
        );

        return response()->json([
            'message' => 'Revisions requested',
            'workflow' => $workflow->fresh()->load('feedback'),
        ]);
    }

    /**
     * Add feedback
     */
    public function addFeedback(Request $request, ApprovalWorkflow $workflow): JsonResponse
    {
        $validated = $request->validate([
            'feedback_text' => 'required|string',
            'feedback_type' => 'required|in:comment,revision_request,approval,rejection',
        ]);

        $workflow->addFeedback(
            $validated['feedback_text'],
            $validated['feedback_type'],
            null,
            auth()->user()
        );

        return response()->json([
            'message' => 'Feedback added',
            'workflow' => $workflow->fresh()->load('feedback'),
        ]);
    }

    /**
     * Get pending approvals (for staff)
     */
    public function getPending(): JsonResponse
    {
        if (auth()->user()->role !== 'staff') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $pending = $this->approvalService->getPendingApprovals('review');

        return response()->json([
            'data' => $pending,
        ]);
    }

    /**
     * Get approval statistics (for admin)
     */
    public function getStats(): JsonResponse
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $stats = $this->approvalService->getApprovalStats();

        return response()->json(['data' => $stats]);
    }
}
