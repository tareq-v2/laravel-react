<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(){
        $notifications = Notification::whereNull('read_at')
        ->orderBy('created_at', 'desc')->get();
          return response()->json([
            'success' => true,
            'notifications' => $notifications
        ]);
    }

    public function markAsRead(Notification $notification)
    {
        $notification->update(['read_at' => now()]);
        return response()->json(['success' => true]);
    }
}
