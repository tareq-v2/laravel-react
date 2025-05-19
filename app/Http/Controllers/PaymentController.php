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
        dd($request->all());
        // Use SECRET KEY from .env
        Stripe::setApiKey(env('STRIPE_SECRET')); 
        
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

            $draft = DraftPost::where('ip_address', $request->ip);
            $draftData = json_decode($draft->data, true);

            // Create main post based on model type
            switch ($draftData['model']) {
                case 'JobOffer':
                    $post = JobOffer::create([
                        'title' => $draftData['title'],
                        'city' => $draftData['city'],
                        'category' => $draftData['category'],
                        'description' => $draftData['description'],
                        'business_name' => $draftData['businessName'],
                        'address' => $draftData['address'],
                        'salary' => $draftData['salary'],
                        'contact_name' => $draftData['name'],
                        'tel_no' => $draftData['telNo'],
                        'tel_ext' => $draftData['telExt'],
                        'alt_tel_no' => $draftData['altTelNo'],
                        'alt_tel_ext' => $draftData['altTelExt'],
                        'email' => $draftData['email'],
                        'website' => $draftData['website'],
                        'keywords' => $draftData['keywords'],
                        'featured' => $draftData['featured'],
                        'user_ip' => $draft->ip_address,
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
                    'image_path' => $attachment->image,
                    'type' => $attachment->type,
                    'original_name' => pathinfo($attachment->image, PATHINFO_FILENAME)
                ]);

                // Optional: Move files from drafts directory to permanent storage
                $oldPath = public_path("drafts/{$attachment->type}/{$attachment->image}");
                $newPath = public_path("job-offers/{$post->id}/{$attachment->image}");
                
                if (File::exists($oldPath)) {
                    File::move($oldPath, $newPath);
                }
            }

            // Cleanup
            AdDraftAttachment::where('user_ip', $draft->ip_address)->delete();
            $draft->delete();
            
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