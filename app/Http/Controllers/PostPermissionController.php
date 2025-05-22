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
}
