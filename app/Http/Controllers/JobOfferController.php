<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JobOffer;
use Carbon\Carbon;

class JobOfferController extends Controller
{
    public function getJobOfferslist()
    {
        $offers = JobOffer::where('is_verified', 1)
        ->orderByRaw("CASE WHEN feature = 'Yes' THEN 0 ELSE 1 END") // Featured first
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($offer) {
            return [
                'id' => $offer->id,
                'title' => $offer->title,
                'description' => $offer->description,
                'created_at' => $offer->created_at,
                'expiration_date' => $offer->expire_date,
                'is_expired' => Carbon::parse($offer->expire_date)->isPast(),
                'is_featured' => $offer->feature === 'Yes',
                'feature' => $offer->feature
            ];
        });

        return response()->json($offers);
    }
}
