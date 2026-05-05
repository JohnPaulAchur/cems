<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventAnalytics extends Model
{
    protected $fillable = [
        'event_id',
        'total_registered',
        'total_attended',
        'satisfaction_score',
        'qa_questions',
        'qa_upvotes',
        'networking_connections',
        'study_circles_created',
        'feedback_submissions',
        'department_breakdown',
        'level_breakdown',
        'no_show_rate',
    ];

    protected $casts = [
        'satisfaction_score' => 'float',
        'no_show_rate' => 'float',
        'department_breakdown' => 'array',
        'level_breakdown' => 'array',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function getAttendanceRate(): float
    {
        if ($this->total_registered === 0) {
            return 0;
        }
        return round(($this->total_attended / $this->total_registered) * 100, 2);
    }

    public function getEngagementScore(): float
    {
        $metrics = $this->qa_questions + $this->networking_connections + $this->study_circles_created;
        return round($metrics / ($this->total_attended ?: 1), 2);
    }
}
