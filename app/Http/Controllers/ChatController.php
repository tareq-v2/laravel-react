<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use App\Events\NewMessage;

class ChatController extends Controller
{
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string'
        ]);

        $message = Message::create([
            'sender_id' => 1,
            'receiver_id' => $request->receiver_id,
            'message' => $request->message
        ]);

        broadcast(new NewMessage($message))->toOthers();

        return response()->json($message);
    }

    public function getMessages($userId)
    {
        $messages = Message::where(function($query) use ($userId) {
            $query->where('sender_id', 1)
                  ->where('receiver_id', $userId);
        })->orWhere(function($query) use ($userId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', 1);
        })->with(['sender', 'receiver'])->get();

        return response()->json($messages);
    }

    public function getActiveAdmins()
    {
        $admins = User::where('role', 'admin')
                 ->get()
                 ->toArray(); // Explicitly convert to array

        return response()->json([
            'success' => true,
            'admins' => $admins // Wrap in a structured response
        ]);
    }
}
