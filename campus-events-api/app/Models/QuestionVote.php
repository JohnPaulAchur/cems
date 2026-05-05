<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionVote extends Model
{
    use HasFactory;

    protected $fillable = ['question_id', 'session_id'];

    public function question()
    {
        return $this->belongsTo(AnonymousQuestion::class);
    }
}
