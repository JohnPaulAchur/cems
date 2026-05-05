<?php

namespace App\Services;

use App\Models\ApprovalWorkflow;
use App\Models\Event;
use App\Models\User;

class ApprovalService
{
    /**
     * Create approval workflow for event
     */
    public function createWorkflow(Event $event): ApprovalWorkflow
    {
        return ApprovalWorkflow::create([
            'event_id' => $event->id,
            'current_step' => 'submitted',
            'submitted_at' => now(),
        ]);
    }

    /**
     * Get workflow for event
     */
    public function getWorkflow(Event $event): ?ApprovalWorkflow
    {
        return ApprovalWorkflow::where('event_id', $event->id)->first();
    }

    /**
     * Approve event
     */
    public function approveEvent(ApprovalWorkflow $workflow, User $approver, string $notes = ''): void
    {
        $workflow->approve($approver, $notes);
        $workflow->event->update(['status' => 'approved']);
    }

    /**
     * Reject event
     */
    public function rejectEvent(ApprovalWorkflow $workflow, User $approver, string $notes = ''): void
    {
        $workflow->reject($approver, $notes);
        $workflow->event->update(['status' => 'rejected']);
    }

    /**
     * Request revisions
     */
    public function requestRevisions(ApprovalWorkflow $workflow, User $approver, string $reason, array $items): void
    {
        $workflow->requestRevision($approver, $reason, $items);
        $workflow->event->update(['status' => 'draft']);
    }

    /**
     * Get pending approvals
     */
    public function getPendingApprovals(string $step = 'review')
    {
        return ApprovalWorkflow::where('current_step', $step)
            ->with('event', 'reviewer')
            ->orderBy('submitted_at')
            ->get();
    }

    /**
     * Get approval statistics
     */
    public function getApprovalStats(): array
    {
        $workflows = ApprovalWorkflow::all();
        
        return [
            'pending' => $workflows->where('current_step', 'review')->count(),
            'approved' => $workflows->where('current_step', 'approved')->count(),
            'rejected' => $workflows->where('current_step', 'rejected')->count(),
            'revision_requested' => $workflows->where('current_step', 'revision_requested')->count(),
            'average_approval_time' => $this->calculateAverageApprovalTime(),
        ];
    }

    /**
     * Calculate average approval time in hours
     */
    private function calculateAverageApprovalTime(): float
    {
        $completedWorkflows = ApprovalWorkflow::whereIn('current_step', ['approved', 'rejected'])
            ->whereNotNull('reviewed_at')
            ->get();

        if ($completedWorkflows->isEmpty()) {
            return 0;
        }

        $totalTime = $completedWorkflows->sum(function ($workflow) {
            return $workflow->reviewed_at->diffInHours($workflow->submitted_at);
        });

        return round($totalTime / $completedWorkflows->count(), 2);
    }
}
