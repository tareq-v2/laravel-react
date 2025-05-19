<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DraftPost;
use App\Models\AdDraftAttachment;

class DraftController extends Controller
{
    public function store(Request $request) {
        $data = [];
        // Handle attachments
        if (isset($request->formData['attachments']) && is_array($request->formData['attachments'])) {
            foreach ($request->formData['attachments'] as $image) {
                // Add file validation
                if ($image instanceof \Illuminate\Http\UploadedFile) {
                    $fileName = uniqid() . '-' . rand() . '.' . $image->extension();
                    $location = public_path('drafts/attachments');
                    $image->move($location, $fileName);
                    
                    AdDraftAttachment::create([
                        'user_ip' => $request->ip,
                        'image' => $fileName,
                        'type' => 'images'
                    ]);
                }
            }
        }

        // Handle social share
        $social = $request->formData['socialShare'] ?? null;
        if ($social && $social instanceof \Illuminate\Http\UploadedFile) {
            $fileName = uniqid() . '-' . rand() . '.' . $social->extension();
            $location = public_path('drafts/social');
            $social->move($location, $fileName);
            
            AdDraftAttachment::create([
                'user_ip' => $request->ip,
                'image' => $fileName,
                'type' => 'social'
            ]);
        }
        // Prepare data array
        $data = [
            'title' => $request->formData['title'],
            'city' => $request->formData['city'],
            'category' => $request->formData['category'],
            'description' => $request->formData['description'],
            'businessName' => $request->formData['businessName'],
            'address' => $request->formData['address'],
            'salary' => $request->formData['salary'],
            'name' => $request->formData['name'],
            'telNo' => $request->formData['telNo'],
            'telExt' => $request->formData['telExt'],
            'altTelNo' => $request->formData['altTelNo'],
            'altTelExt' => $request->formData['altTelExt'],
            'email' => $request->formData['email'],
            'website' => $request->formData['website'],
            'keywords' => $request->formData['keywords'],
            'featured' => $request->formData['featured'],
            'model' => $request->formData['model'],
        ];

        // Create draft post
        $draft = DraftPost::create([
            'ip_address' => $request->ip,
            'data' => json_encode($data),
            'expires_at' => now()->addHours(2)
        ]);

        return response()->json($draft);
    }

    public function getDraft($ip) {
        $draft = DraftPost::where('ip_address', $ip)
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
            'expires_at' => now()->addMinutes(15) // Extended window for completion
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


}
