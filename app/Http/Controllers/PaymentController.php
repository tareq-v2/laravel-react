<?php

namespace App\Http\Controllers;

use App\Models\DraftPost;
use App\Models\JobOffer;
use App\Models\AdDraftAttachment;
use App\Models\JobOfferImage;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class PaymentController extends Controller
{
    public function handlePayment(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET')); 
        DB::beginTransaction();
        try {
            // Validate input
            $validated = $request->validate([
                'paymentMethodId' => 'required',
                'totalAmount' => 'required|numeric|min:0.5',
                'email' => 'required|email',
            ]);

            $draft = DraftPost::where('ip_address', $request->clientIP)
            ->first();
          
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

            if ($draft->processed) {
                return response()->json([
                    'success' => false,
                    'error' => 'This payment has already been processed'
                ], 409);
            }
            $draftData = json_decode($draft->data, true);
            // Create main post based on model type
            switch ($draftData['model']) {
                case 'JobOffer':
                    $post = JobOffer::create([
                        'title' => $draftData['title'],
                        'city' => $draftData['city'],
                        'category' => $draftData['category'],
                        'description' => $draftData['description'],
                        'businessName' => $draftData['businessName'],
                        'address' => $draftData['address'],
                        'salary' => $draftData['salary'],
                        'contactName' => $draftData['name'],
                        'telNo' => $draftData['telNo'],
                        'tel_ext' => $draftData['telExt'],
                        'altTelNo' => $draftData['altTelNo'],
                        'alt_tel_ext' => $draftData['altTelExt'],
                        'email' => $draftData['email'],
                        'website' => $draftData['website'],
                        'keywords' => $draftData['keywords'],
                        'feature' => $draftData['featured'],
                        // 'user_ip' => $draft->ip_address,
                    ]);
                    break;
                
                // Add other model types here if needed
                default:
                    throw new \Exception('Unknown model type');
            }

            // Process attachments
            $attachments = AdDraftAttachment::where('user_ip', $draft->ip_address)->get();
            foreach ($attachments as $attachment) {
                JobOfferImage::create([
                    'job_offer_id' => $post->id,
                    'image_path' => $attachment->image ?? 'image',
                    'type' => 'jobOffer',
                    'original_name' => pathinfo($attachment->image, PATHINFO_FILENAME)
                ]);

                // Optional: Move files from drafts directory to permanent storage
                $oldPath = public_path("drafts/attachments/{$attachment->image}");
                $newPath = public_path("jobOffers/attachments/{$attachment->image}");
                
                if (File::exists($oldPath)) {
                    File::move($oldPath, $newPath);
                }
            }

            // Cleanup
            AdDraftAttachment::where('user_ip', $draft->ip_address)->delete();
            $draft->delete();
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

            DB::commit();

            if ($paymentIntent->status === 'succeeded') {
                return response()->json([
                    'success' => true,
                    'post_id' => $post->id,
                    'message' => 'Payment successful!'
                ]);
            }


        } catch (ApiErrorException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
        
    }
}