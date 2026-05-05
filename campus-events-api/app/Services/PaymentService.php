<?php

namespace App\Services;

use App\Models\Event;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Collection;

class PaymentService
{
    /**
     * Create a payment record
     */
    public function createPayment(User $user, Event $event, float $amount, array $items): Payment
    {
        return Payment::create([
            'user_id' => $user->id,
            'event_id' => $event->id,
            'amount' => $amount,
            'items' => $items,
            'status' => 'pending',
        ]);
    }

    /**
     * Get payment checkout data with resources
     */
    public function getCheckoutData(Event $event): array
    {
        $resources = $event->resources()->get();
        
        return [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
            ],
            'resources' => $resources->map(function ($resource) {
                return [
                    'id' => $resource->id,
                    'type' => $resource->resource_type,
                    'cost' => $resource->cost,
                    'available' => $resource->getAvailableQuantity(),
                    'description' => $resource->description,
                ];
            }),
        ];
    }

    /**
     * Calculate total payment amount
     */
    public function calculateAmount(array $items): float
    {
        $total = 0;
        foreach ($items as $item) {
            $total += $item['cost'] * ($item['quantity'] ?? 1);
        }
        return round($total, 2);
    }

    /**
     * Get payment history for user
     */
    public function getUserPaymentHistory(User $user): Collection
    {
        return Payment::where('user_id', $user->id)
            ->with('event')
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Get event revenue
     */
    public function getEventRevenue(Event $event): float
    {
        return Payment::where('event_id', $event->id)
            ->where('status', 'completed')
            ->sum('amount');
    }

    /**
     * Get payment statistics for admin
     */
    public function getPaymentStats(): array
    {
        return [
            'total_revenue' => Payment::where('status', 'completed')->sum('amount'),
            'pending_payments' => Payment::where('status', 'pending')->count(),
            'total_transactions' => Payment::where('status', 'completed')->count(),
            'average_transaction' => Payment::where('status', 'completed')->avg('amount'),
        ];
    }
}
