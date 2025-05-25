<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Banner;

class BannerController extends Controller
{
    public function getTopBanner(){
        $banners = Banner::where('spot', 1)
            ->where('status', 1)
            ->inRandomOrder()
            ->take(5)
            ->get();

        if ($banners->isNotEmpty()) {
            return response()->json([
                'success' => true,
                'banner' => $banners
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No active top banner found.'
        ]);
    }
    public function getSpot2Banners()
    {
        $banners = Banner::where('spot', 2)
            ->where('status', 1)
             ->inRandomOrder()
            ->orderBy('created_at', 'desc')
            ->take(5) // Limit to 5 banners
            ->get();

        if ($banners->isNotEmpty()) {
            return response()->json([
                'success' => true,
                'banners' => $banners
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No active banners found for spot 2'
        ]);
    }
    public function getSpotBanners($spot)
    {
        $banners = Banner::where('spot', $spot)
            ->where('status', 1)
            ->inRandomOrder()
            ->take(5)
            ->get();

        return response()->json([
            'success' => !$banners->isEmpty(),
            'banners' => $banners,
            'message' => $banners->isEmpty() ? "No active banners found for spot $spot" : ''
        ]);
    }

    public function getSpot3Banners() { return $this->getSpotBanners(3); }
    public function getSpot4Banners() { return $this->getSpotBanners(4); }
    public function getSpot5Banners() { return $this->getSpotBanners(5); }
}
