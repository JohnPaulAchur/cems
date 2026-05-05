<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnonymousQuestion extends Model
{
    use HasFactory;

    protected $fillable = ['event_id', 'question_text', 'votes', 'status', 'is_pinned', 'answer'];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function votes()
    {
        return $this->hasMany(QuestionVote::class, 'question_id');
    }
}
