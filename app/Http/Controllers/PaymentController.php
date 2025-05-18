<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe; // ← Missing import
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;

class PaymentController extends Controller
{
    public function handlePayment(Request $request)
    {
        // Use SECRET KEY from .env
        Stripe::setApiKey(env('STRIPE_SECRET')); // ← Must be sk_test_...
        
        try {
            // Validate input
            $validated = $request->validate([
                'paymentMethodId' => 'required',
                'totalAmount' => 'required|numeric|min:0.5',
                'email' => 'required|email',
            ]);

            // Create PaymentIntent
            $paymentIntent = PaymentIntent::create([
                'amount' => $validated['totalAmount'] * 100,
                'currency' => 'usd',
                'payment_method' => $validated['paymentMethodId'],
                'automatic_payment_methods' => [
                    'enabled' => true,
                    'allow_redirects' => 'never',
                ],
                'confirm' => true,
                'metadata' => [
                    'post_id' => $request->postId,
                    'email' => $validated['email']
                ]
            ]);

            if ($paymentIntent->status === 'succeeded') {
                return response()->json([
                    'success' => true,
                    'message' => 'Payment successful!'
                ]);
            }

        } catch (ApiErrorException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }
}