<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DraftPost;

class DraftController extends Controller
{
    public function store(Request $request) {
        $data = $request->validate([
            'formData' => 'required|array',
            'ip' => 'required|string'
        ]);
        $draft = DraftPost::updateOrCreate(
            [
                'ip_address' => $data['ip'],
                'model' => $data['formData']['model'],
                'data' => json_encode($data['formData']),
                'expires_at' => now()->addHours(2)
            ]
        );
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
