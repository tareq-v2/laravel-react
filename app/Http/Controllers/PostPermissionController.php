<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\JobOffer;
use App\Mail\AdApproveMail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class PostPermissionController extends Controller
{
    public function verify($id)
    {
        $post = JobOffer::find($id);
        $post->update(['is_verified' => 1]);
        $notification = Notification::where('post_type', 'jobOffer')->where('data->post_id', $id)->first();
        if($notification) {
            $notification->read_at = now();
            $notification->save();
        }
        $userName = User::where('id', $post->user_id)->value('name');
        $userName = $userName ? $userName : 'Guest';
        Mail::to($post['email'])->send(new AdApproveMail($post, $userName));
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
