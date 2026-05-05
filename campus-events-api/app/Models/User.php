<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'department',
        'level',
        'interests',
        'phone',
        'bio',
        'avatar_url',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'interests' => 'array',
    ];

    public function events()
    {
        return $this->hasMany(Event::class, 'organizer_id');
    }

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function classes()
    {
        return $this->hasMany(StudentClass::class);
    }

    public function exams()
    {
        return $this->hasMany(StudentExam::class);
    }

    public function approvals()
    {
        return $this->hasMany(EventApproval::class, 'approver_id');
    }

    public function studyCircles()
    {
        return $this->hasMany(StudyCircle::class, 'created_by');
    }

    public function studyCircleMemberships()
    {
        return $this->belongsToMany(StudyCircle::class, 'study_circle_members');
    }

    public function connections()
    {
        return $this->belongsToMany(User::class, 'connections', 'user_id', 'connected_user_id');
    }

    public function interests()
    {
        return $this->hasMany(StudentInterest::class);
    }
}
