<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    public function __construct(private PaymentService $paymentService) {}

    /**
     * Get checkout data for event resources
     */
    public function getCheckoutData(Event $event): JsonResponse
    {
        return response()->json([
            'data' => $this->paymentService->getCheckoutData($event),
        ]);
    }

    /**
     * Create payment record and return session
     */
    public function createPayment(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer',
            'items.*.type' => 'required|string',
            'items.*.cost' => 'required|numeric',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $amount = $this->paymentService->calculateAmount($validated['items']);
        
        $payment = $this->paymentService->createPayment(
            auth()->user(),
            $event,
            $amount,
            $validated['items']
        );

        return response()->json([
            'payment_id' => $payment->id,
            'amount' => $amount,
            'stripe_session_url' => url('/checkout/' . $payment->id),
        ]);
    }

    /**
     * Get user payment history
     */
    public function getHistory(): JsonResponse
    {
        $payments = $this->paymentService->getUserPaymentHistory(auth()->user());

        return response()->json([
            'data' => $payments,
        ]);
    }

    /**
     * Get payment details
     */
    public function show(Payment $payment): JsonResponse
    {
        $this->authorize('view', $payment);

        return response()->json([
            'data' => $payment->load('event'),
        ]);
    }

    /**
     * Confirm payment (from Stripe webhook)
     */
    public function confirmPayment(Payment $payment): JsonResponse
    {
        $payment->markCompleted();

        return response()->json([
            'message' => 'Payment confirmed',
            'payment' => $payment,
        ]);
    }

    /**
     * Get revenue for event
     */
    public function getEventRevenue(Event $event): JsonResponse
    {
        $this->authorize('update', $event);

        $revenue = $this->paymentService->getEventRevenue($event);

        return response()->json([
            'event_id' => $event->id,
            'total_revenue' => $revenue,
        ]);
    }

    /**
     * Get admin payment statistics
     */
    public function getStats(): JsonResponse
    {
        // Only admins can access
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $stats = $this->paymentService->getPaymentStats();

        return response()->json(['data' => $stats]);
    }
}
