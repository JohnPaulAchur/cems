<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ApprovalWorkflow extends Model
{
    protected $fillable = [
        'event_id',
        'current_step',
        'reviewed_by',
        'review_notes',
        'submitted_at',
        'reviewed_at',
        'revision_deadline',
        'revision_count',
        'workflow_history',
    ];

    protected $casts = [
        'workflow_history' => 'array',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'revision_deadline' => 'datetime',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function feedback(): HasMany
    {
        return $this->hasMany(ApprovalFeedback::class);
    }

    public function addFeedback(string $text, string $type, ?array $revisionItems = null, User $user): ApprovalFeedback
    {
        return $this->feedback()->create([
            'user_id' => $user->id,
            'feedback_text' => $text,
            'feedback_type' => $type,
            'revision_items' => $revisionItems,
        ]);
    }

    public function approve(User $user, string $notes = ''): void
    {
        $this->update([
            'current_step' => 'approved',
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
            'review_notes' => $notes,
        ]);
    }

    public function reject(User $user, string $notes = ''): void
    {
        $this->update([
            'current_step' => 'rejected',
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
            'review_notes' => $notes,
        ]);
    }

    public function requestRevision(User $user, string $reason, array $items): void
    {
        $this->increment('revision_count');
        $this->update([
            'current_step' => 'revision_requested',
            'reviewed_by' => $user->id,
            'revision_deadline' => now()->addDays(3),
        ]);
        $this->addFeedback($reason, 'revision_request', $items, $user);
    }
}
