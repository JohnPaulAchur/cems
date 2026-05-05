<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventAttendeeStats extends Model
{
    use HasFactory;

    protected $fillable = ['event_id', 'total_registered', 'trending_score'];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
