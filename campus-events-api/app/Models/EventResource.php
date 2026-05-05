<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventResource extends Model
{
    protected $fillable = [
        'event_id',
        'resource_type',
        'cost',
        'quantity_available',
        'quantity_booked',
        'description',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function getAvailableQuantity(): int
    {
        return $this->quantity_available - $this->quantity_booked;
    }

    public function bookResource(int $quantity = 1): bool
    {
        if ($this->getAvailableQuantity() >= $quantity) {
            $this->increment('quantity_booked', $quantity);
            return true;
        }
        return false;
    }
}
