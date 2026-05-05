<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentClass extends Model
{
    use HasFactory;

    protected $table = 'student_classes';
    protected $fillable = ['user_id', 'course_name', 'day_of_week', 'start_time', 'end_time', 'semester'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
