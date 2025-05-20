<?php

public function handlePayment(Request $request)
{
    DB::beginTransaction();
    try {
        $draft = DraftPost::where('ip_address', $request->clientIP)
            ->lockForUpdate() // Prevent concurrent requests
            ->first();

        // Validate draft existence and expiration
        if (!$draft) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid or expired payment session'
            ], 410);
        }

        if ($draft->created_at->diffInMinutes(now()) > 30) {
            return response()->json([
                'success' => false,
                'error' => 'Payment session expired'
            ], 410);
        }

        // Prevent duplicate processing
        if ($draft->processed) {
            return response()->json([
                'success' => false,
                'error' => 'This payment has already been processed'
            ], 409);
        }

        // Mark as processed immediately
        $draft->update(['processed' => true]);

        // ... rest of your existing code ...

        // Process payment after creating post
        $paymentIntent = PaymentIntent::create([
            // ... your existing payment intent code ...
        ]);

        // Only commit if everything succeeds
        DB::commit();

        return response()->json([
            'success' => true,
            'post_id' => $post->id,
            'message' => 'Payment successful!'
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
}