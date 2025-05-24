<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\JobOffer;

class PostPermissionController extends Controller
{
    public function verify($id)
    {
        JobOffer::find($id)->update(['is_verified' => 1]);
        return response()->json(['success' => true]);
    }
    public function getUnVerifiedPost($id)
    {
        $post = JobOffer::with('images')->findOrFail($id);
        
        return response()->json([
            'success' => true, 
            'data' => $post,
            'images' => $post->images->map(function($image) {
                return [
                    'url' => asset("/jobOffers/attachments/{$image->image_path}"),
                    'original_name' => $image->original_name
                ];
            })
        ]);
    }
}
