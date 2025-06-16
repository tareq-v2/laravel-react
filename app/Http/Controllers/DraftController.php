<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DraftPost;
use App\Models\AdDraftAttachment;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class DraftController extends Controller
{
    public function store(Request $request) {
        // Determine the model type
        $model = $request->input('model', $request->formData['model'] ?? null);
        
        // Handle business form data
        if ($model === 'Directory') {
            $data = $request->except(['_token', 'ip', 'logo', 'thumbnails']);
            
            // Process logo
            if ($request->hasFile('logo')) {
                $logoFile = $request->file('logo');
                $fileName = uniqid() . '-' . rand() . '.' . $logoFile->extension();
                $location = public_path('drafts/attachments');
                $logoFile->move($location, $fileName);
                
                AdDraftAttachment::create([
                    'user_ip' => $request->ip(),
                    'session_id' => $request->sessionId,
                    'image' => $fileName,
                    'type' => 'logo'
                ]);
            }
            
            // Process thumbnails
            if ($request->has('thumbnails')) {
                foreach ($request->file('thumbnails') as $thumbnail) {
                    if ($thumbnail->isValid()) {
                        $fileName = uniqid() . '-' . rand() . '.' . $thumbnail->extension();
                        $location = public_path('drafts/attachments');
                        $thumbnail->move($location, $fileName);
                        
                        AdDraftAttachment::create([
                            'user_ip' => $request->ip(),
                            'session_id' => $request->sessionId,
                            'image' => $fileName,
                            'type' => 'thumbnail'
                        ]);
                    }
                }
            }
            
            // Handle array fields
            if (isset($data['subCategories'])) {
                $data['subCategories'] = json_encode($data['subCategories']);
            }
            
            // Handle working hours
            $hourFields = [
                'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
                'monday_startTime', 'monday_endTime', 'tuesday_startTime', 'tuesday_endTime',
                'wednesday_startTime', 'wednesday_endTime', 'thursday_startTime', 'thursday_endTime',
                'friday_startTime', 'friday_endTime', 'saturday_startTime', 'saturday_endTime',
                'sunday_startTime', 'sunday_endTime', 'hide_hour'
            ];
            
            foreach ($hourFields as $field) {
                if (isset($data[$field])) {
                    $data[$field] = $data[$field];
                }
            }
        } 
        // Handle job offer form data
        elseif ($model === 'JobOffer') {
            $data = $request->formData;
            // Process job offer attachments
            if (isset($data['attachments']) && is_array($data['attachments'])) {
                foreach ($data['attachments'] as $image) {
                    if ($image instanceof \Illuminate\Http\UploadedFile) {
                        $fileName = uniqid() . '-' . rand() . '.' . $image->extension();
                        $location = public_path('drafts/attachments');
                        $image->move($location, $fileName);
                        
                        AdDraftAttachment::create([
                            'user_ip' => $request->ip,
                            'session_id' => $request->sessionId,
                            'image' => $fileName,
                            'type' => 'images'
                        ]);
                    }
                }
            }

            // Process social share
            $social = $data['socialShare'] ?? null;
            if ($social && $social instanceof \Illuminate\Http\UploadedFile) {
                $fileName = uniqid() . '-' . rand() . '.' . $social->extension();
                $location = public_path('drafts/social');
                $social->move($location, $fileName);
                
                AdDraftAttachment::create([
                    'user_ip' => $request->ip,
                    'session_id' => $request->sessionId,
                    'image' => $fileName,
                    'type' => 'social'
                ]);
            }
        } 
        else {
            return response()->json(['error' => 'Invalid model type'], 400);
        }

        // Create draft post
        $draft = DraftPost::create([
            'ip_address' => $request->ip,
            'session_id' => $request->sessionId,
            'data' => json_encode($data),
            'expires_at' => now()->addHours(2)
        ]);

        return response()->json($draft);
    }

    public function getDraft(Request $request) {
        // dd($request->all());
        // $draft = DraftPost::where('session_id', $request->sessionId)
        //     //   ->where('model', $request->model)
        //       ->where('expires_at', '>', now())
        //       ->first();
              
        // if (!$draft) {
        //     return response()->json(['exists' => false]);
        // }
        
        // $data = json_decode($draft->data, true);
        
        // // Handle file paths for business form
        // if ($request->model === 'Directory') {
        //     $logoAttachment = AdDraftAttachment::where('session_id', $request->sessionId)
        //     ->where('type', 'logo')
        //     ->first();
        //     if ($logoAttachment) {
        //         $data['logo'] = asset('drafts/attachments/' . $logoAttachment->image);
        //     }
            
        //     // Get thumbnails
        //     $thumbnailAttachments = AdDraftAttachment::where('session_id', $request->sessionId)
        //         ->where('type', 'thumbnail')
        //         ->get();
        //     $thumbnails = [];
        //     foreach ($thumbnailAttachments as $attachment) {
        //         $thumbnails[] = asset('drafts/attachments/' . $attachment->image);
        //     }
        //     $data['thumbnails'] = $thumbnails;
            
        //     if (isset($data['subCategories'])) {
        //         $data['subCategories'] = json_decode($data['subCategories'], true);
        //     }
        // }

        $draft = DraftPost::where('ip_address', $request->ip)
              ->orWhere('session_id', $request->sessionId)
              ->where('expires_at', '>', now())
              ->whereNull('retrieved_at')
              ->latest()
              ->first();
        if (!$draft) {
            return response()->json(['exists' => false]);
        }

        // Mark as retrieved but keep the record
        $draft->update([
            'retrieved_at' => now(),
            'expires_at' => now()->addMinutes(15)
        ]);
        
        return response()->json([
            'exists' => true,
            'data' => json_decode($draft->data, true),
            'draft_id' => $draft->id
        ]);
    }

    public function confirmDraftUsage($id)
    {
        DraftPost::where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    public function initSession(Request $request)
    {
        $sessionId = Str::uuid();
        return response()->json(['session_id' => $sessionId]);
    }
}
