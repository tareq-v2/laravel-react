<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JobOffer;
use Carbon\Carbon;

class JobOfferController extends Controller
{
    public function getJobOfferslist(Request $request)
    {
        $now = Carbon::now();
        $featureCutoff = $now->copy()->subHours(24);
        $perPage = 16;

        $query = JobOffer::where('is_verified', true)
            ->where('expire_date', '>', $now)
            ->orderByRaw(
                "CASE 
                    WHEN feature = 'Yes' AND featured_at >= '{$featureCutoff->toDateTimeString()}'
                    THEN 1 
                    ELSE 0 
                END DESC"
            )
            ->orderByRaw(
                "CASE 
                    WHEN feature = 'Yes' AND featured_at >= '{$featureCutoff->toDateTimeString()}'
                    THEN UNIX_TIMESTAMP(featured_at) 
                    ELSE UNIX_TIMESTAMP(created_at) 
                END DESC"
            );

        $paginator = $query->paginate($perPage);

        $transformed = $paginator->getCollection()->map(function (JobOffer $offer) use ($now, $featureCutoff) {
            return [
                'id' => $offer->id,
                'title' => $offer->title,
                'description' => $offer->description,
                'created_at' => $offer->created_at->toIso8601String(),
                'expiration_date' => $offer->expire_date->toIso8601String(),
                'is_expired' => $now->gt($offer->expire_date),
                'is_featured' => $this->isFeatured($offer, $featureCutoff),
                'feature' => $offer->feature,
                'featured_at' => $offer->featured_at?->toIso8601String()
            ];
        });

        return response()->json([
            'current_page' => $paginator->currentPage(),
            'data' => $transformed,
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
        ]);
    }

    protected function isFeatured(JobOffer $offer, Carbon $cutoff): bool
    {
        return $offer->feature === 'Yes' 
            && $offer->featured_at 
            && $offer->featured_at->gte($cutoff);
    }
}