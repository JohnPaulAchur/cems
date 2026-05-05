<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentExam extends Model
{
    use HasFactory;

    protected $table = 'student_exams';
    protected $fillable = ['user_id', 'exam_name', 'exam_date', 'exam_time', 'duration', 'location'];

    protected $casts = [
        'exam_date' => 'date',
        'exam_time' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
