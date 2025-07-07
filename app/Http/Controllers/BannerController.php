<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\BannerCategory;
use App\Models\Banner;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Carbon\Carbon;

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
    public function getSpot6Banners() { return $this->getSpotBanners(6); }

    public function bannerFinalPost(Request $request){
        // dd($request->all());
        // Validate request
        $validated = $request->validate([
            'card_holder_name' => 'required',
            'street' => 'required',
            'city' => 'required',
            'state' => 'required',
            'zip' => 'required',
            'country' => 'required',
            'phone' => 'required',
            'email' => 'required|email',
            'totalAmount' => 'required|numeric',
            'bannerData' => 'required|array'
        ]);

        // Process payment
        if ($request->totalAmount > 0) {
            Stripe::setApiKey(env('STRIPE_SECRET'));

            try {
                PaymentIntent::create([
                    'amount' => $request->totalAmount * 100,
                    'currency' => 'usd',
                    'payment_method' => $request->paymentMethodId,
                    'automatic_payment_methods' => [
                        'enabled' => true,
                        'allow_redirects' => 'never' // Explicitly disable redirects
                    ],
                    'confirm' => true,
                    'metadata' => [
                        'email' => $request->email
                    ]
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment failed: ' . $e->getMessage()
                ], 400);
            }
        }

        // Save banner to database
        try {
            $banner = new Banner();
            $banner->user_id = Auth::id() ?? null;
            $banner->spot = $request->bannerData['banner_category'];
            $banner->external_link = $request->bannerData['external_link'] ?? null;
            $banner->email = $request->bannerData['customer_email'];
            $banner->expire_date = Carbon::now()->addDays((int)$request->bannerData['expire_date']);
            $banner->expire_period = (int)$request->bannerData['expire_date'];
            $banner->override = $request->bannerData['override'];
            $banner->payment_status = 1;
            $banner->status = 0; // Pending admin approval

            // Save image
            if (!empty($request->bannerData['banner_images'])) {
                $banner = $request->bannerData['banner_images'];
                $fileName = uniqid() . '-' . rand() . '.' . $banner->extension();
                $location = public_path('uploads/banners');
                $banner->move($location, $fileName);
                $banner->images = $fileName;
            }

            // Save payment details
            $banner->card_holder_name = $request->card_holder_name;
            $banner->street = $request->street;
            $banner->city = $request->city;
            $banner->state = $request->state;
            $banner->zip = $request->zip;
            $banner->country = $request->country;
            $banner->phone = $request->phone;
            $banner->email = $request->email;
            $banner->amount = $request->totalAmount;
            $banner->save();

            return response()->json([
                'success' => true,
                'post_id' => $banner->id
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Banner creation failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getBannerCategories(){
        return BannerCategory::all();
    }

    public function bannerRates() {
        return response()->json([
            'base_rate' => 50 // Default rate, customize as needed
        ]);
    }
}
