<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'organizer_id',
        'venue_id',
        'title',
        'description',
        'category',
        'event_date',
        'event_time',
        'event_end_time',
        'capacity',
        'status',
        'tags',
    ];

    protected $casts = [
        'event_date' => 'date',
        'event_time' => 'datetime',
        'event_end_time' => 'datetime',
        'tags' => 'array',
    ];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function approvals()
    {
        return $this->hasMany(EventApproval::class);
    }

    public function studyCircles()
    {
        return $this->hasMany(StudyCircle::class);
    }

    public function questions()
    {
        return $this->hasMany(AnonymousQuestion::class);
    }

    public function stats()
    {
        return $this->hasOne(EventAttendeeStats::class);
    }

    public function recommendationLogs()
    {
        return $this->hasMany(RecommendationLog::class);
    }

    public function getRegisteredUsersCount()
    {
        return $this->registrations()->where('status', 'registered')->count();
    }
}
