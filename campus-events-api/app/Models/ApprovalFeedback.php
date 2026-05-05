<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApprovalFeedback extends Model
{
    protected $table = 'approval_feedback';

    protected $fillable = [
        'approval_workflow_id',
        'user_id',
        'feedback_text',
        'feedback_type',
        'revision_items',
    ];

    protected $casts = [
        'revision_items' => 'array',
    ];

    public function workflow(): BelongsTo
    {
        return $this->belongsTo(ApprovalWorkflow::class, 'approval_workflow_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
