<?php

namespace App\Http\Controllers;

use App\Models\DraftPost;
use App\Models\JobOffer;
use App\Models\Directory;
use App\Models\AdDraftAttachment;
use App\Models\JobOfferImage;
use App\Models\DirectoryImage;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;
use App\Mail\AdOrderMail;

class PaymentController extends Controller
{
    protected $modelProcessors = [
        'JobOffer' => 'processJobOffer',
        'Directory' => 'processDirectory',
        // Add new models here: 'NewModel' => 'processNewModel'
    ];

    public function handlePayment(Request $request)
    {
        Stripe::setApiKey('sk_test_51LESvVLGpkKyPO47ElCFEYUmLkNw8iuzjB7Equ9ZB9tOzWdLxQ6akdTQp3plJmpDQ72AEEjl611uVCmzZqFAudem00BzXM9pN1');

        DB::beginTransaction();

        try {
            $validated = $this->validateRequest($request);
            $draft = $this->getValidDraft($validated['sessionId']);

            $draftData = json_decode($draft->data, true);
            $modelType = $draftData['model'];

            if (!isset($this->modelProcessors[$modelType])) {
                throw new \Exception("Unknown model type: $modelType");
            }

            $processor = $this->modelProcessors[$modelType];
            $post = $this->$processor($draft, $draftData);

            $this->cleanupDraftAttachments($draft);
            $paymentIntent = $this->createPaymentIntent($validated, $post->id);
            $this->sendNotification($modelType, $post->id);
            $this->sendConfirmationEmail($post, $paymentIntent->id, $validated['email']);
            $draft->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'post_id' => $post->id,
                'message' => 'Payment successful!'
            ]);

        } catch (ApiErrorException $e) {
            DB::rollBack();
            return $this->paymentError($e->getMessage());
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->paymentError($e->getMessage());
        }
    }

    protected function validateRequest(Request $request)
    {
        return $request->validate([
            'paymentMethodId' => 'required',
            'sessionId' => 'required|uuid',
            'totalAmount' => 'required|numeric|min:0.5',
            'email' => 'required|email',
        ]);
    }

    protected function getValidDraft($sessionId)
    {
        $expiredThreshold = Carbon::now()->subHours(config('drafts.expiration_hours', 2));

        // Clean up expired drafts
        DraftPost::where('session_id', $sessionId)
            ->where('created_at', '<', $expiredThreshold)
            ->delete();

        $draft = DraftPost::where('session_id', $sessionId)->first();

        if (!$draft) {
            throw new \Exception('Invalid or expired payment session');
        }

        if ($draft->created_at->lt($expiredThreshold)) {
            throw new \Exception('Draft session expired');
        }

        if ($draft->created_at->diffInMinutes(now()) > 30) {
            throw new \Exception('Payment session expired');
        }

        if ($draft->processed) {
            throw new \Exception('This payment has already been processed');
        }

        return $draft;
    }

    protected function processJobOffer(DraftPost $draft, array $draftData)
    {
        $jobOffer = JobOffer::create([
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
            'user_id' => Auth::id(),
            'expire_date' => Carbon::now()->addDays(30),
            'featured_at' => Carbon::now()
        ]);

        $this->processJobAttachments($draft, $jobOffer->id);

        return $jobOffer;
    }

    protected function processDirectory(DraftPost $draft, array $draftData)
    {
        $directory = Directory::create([
            'user_id' => Auth::id(),
            'businessName' => $draftData['businessName'],
            'address' => $draftData['address'],
            'suite' => $draftData['suite'],
            'city' => $draftData['city'],
            'category' => $draftData['category'],
            'subCategory' => $draftData['subCategory'] ?? null,
            'description' => $draftData['description'] ?? null,
            'telNo' => $draftData['telNo'],
            'tel_ext' => $draftData['tel_ext'] ?? null,
            'altTelNo' => $draftData['altTelNo'] ?? null,
            'alt_tel_ext' => $draftData['alt_tel_ext'] ?? null,
            'email' => $draftData['email'],
            'website' => $draftData['website'] ?? null,
            'facebook' => $draftData['facebook'] ?? null,
            'instagram' => $draftData['instagram'] ?? null,
            'status' => 0,
            'unique_id' => Str::uuid(),
            'package' => $draftData['package'] ?? null,
            'expire_date' => Carbon::now()->addYear(),
            // Add other directory-specific fields
        ]);

        $this->processDirectoryAttachments($draft, $directory->id);

        return $directory;
    }

    protected function processJobAttachments(DraftPost $draft, $jobId)
    {
        $attachments = AdDraftAttachment::where('session_id', $draft->session_id)->get();

        foreach ($attachments as $attachment) {
            $oldPath = public_path("drafts/attachments/{$attachment->image}");
            $newPath = public_path("jobOffers/attachments/{$attachment->image}");

            if (File::exists($oldPath)) {
                File::move($oldPath, $newPath);
            }

            JobOfferImage::create([
                'job_offer_id' => $jobId,
                'image_path' => $attachment->image,
                'type' => 'jobOffer',
                'original_name' => pathinfo($attachment->image, PATHINFO_FILENAME)
            ]);
        }
    }

    protected function processDirectoryAttachments(DraftPost $draft, $directoryId)
    {
        $thumbnailAttachments = AdDraftAttachment::where('session_id', $draft->session_id)
            ->where('type', 'thumbnail')
            ->get();

        foreach ($thumbnailAttachments as $attachment) {
            $oldPath = public_path("drafts/attachments/{$attachment->image}");
            $newPath = public_path("directory/attachments/{$attachment->image}");

            if (File::exists($oldPath)) {
                File::move($oldPath, $newPath);
            }

            DirectoryImage::create([
                'directory_id' => $directoryId,
                'image' => $attachment->image
            ]);
        }
    }

    protected function cleanupDraftAttachments(DraftPost $draft)
    {
        AdDraftAttachment::where('session_id', $draft->session_id)->delete();
    }

    protected function createPaymentIntent(array $data, $postId)
    {
        return PaymentIntent::create([
            'amount' => $data['totalAmount'] * 100,
            'currency' => 'usd',
            'payment_method' => $data['paymentMethodId'],
            'automatic_payment_methods' => ['enabled' => true, 'allow_redirects' => 'never'],
            'confirm' => true,
            'metadata' => [
                'post_id' => $postId,
                'email' => $data['email']
            ]
        ]);
    }

    protected function sendNotification($modelType, $postId)
    {
        Notification::create([
            'notification_type' => 'Post Request',
            'post_type' => $modelType,
            'data' => json_encode([
                'message' => 'New post requires approval',
                'post_id' => $postId
            ])
        ]);
    }

    protected function sendConfirmationEmail($post, $paymentIntentId, $email)
    {
        $userName = Auth::check() ? Auth::user()->name : 'Guest';

        if ($post instanceof JobOffer) {
            $post->load('images');
            $post->images_url = $post->images->map(function($image) {
                return [
                    'url' => asset("jobOffers/attachments/{$image->image_path}"),
                    'name' => $image->original_name,
                    'type' => pathinfo($image->image_path, PATHINFO_EXTENSION)
                ];
            });
        }

        // Add similar processing for other models if needed

        Mail::to($email)->send(new AdOrderMail($post, $paymentIntentId, $userName));
    }

    protected function paymentError($message, $code = 500)
    {
        return response()->json([
            'success' => false,
            'error' => $message
        ], $code);
    }
}
