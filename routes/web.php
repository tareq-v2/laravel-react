<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DirectoryController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\FrontendController;
use App\Http\Controllers\DraftController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChatController;
use App\Models\HomeVideo;
use App\Models\DirectoryRate;
use Illuminate\Http\Request;
use App\Models\GuestMessage;
use App\Models\AdSubCategory;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PostPermissionController;
use App\Http\Controllers\JobOfferController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\BlogController;
use App\Models\BannerCategory;
use App\Models\Banner;
use Carbon\Carbon;
use Stripe\Stripe;
use Stripe\PaymentIntent;

Route::post('/ads/final/post', [PaymentController::class, 'handlePayment']);

Route::get('/test-broadcast', function() {
    return [
        'broadcast_provider' => class_exists(\App\Providers\BroadcastServiceProvider::class),
        'broadcast_driver' => config('broadcasting.default'),
        'pusher_config' => config('broadcasting.connections.pusher')
    ];
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('ad/category/icons', [FrontendController::class, 'categoryIcons']);
Route::get('ad/sub/category/icons/{id}', [FrontendController::class, 'subCategoryIcons']);
Route::get('directory/category/icons', [DirectoryController::class, 'categoryIcons']);
Route::post('job-offers-post', [FrontendController::class, 'jobOfferPost']);
Route::get('job-offers/{id}', [FrontendController::class, 'jobOfferConfirm']);

Route::get('/user/blogs/{id}', [BlogController::class, 'showBlog']);
Route::get('/blogs/{id}/adjacent', [BlogController::class, 'adjacent']);
Route::get('/blogs/{id}/comments', [BlogController::class, 'comments']);

// Like routes (protected by auth)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/blogs/{id}/like', [BlogController::class, 'like']);
    Route::post('/blogs/{id}/comments', [BlogController::class, 'postComment']);
});
Route::get('/job-offer-categories', function() {
    $categories = \App\Models\JobOfferCategory::all();
    return array_chunk($categories->toArray(), ceil($categories->count() / 4));
});

Route::get('job/offer/rate', function(){
    $rates = AdSubCategory::find(1);
    return response()->json([
        'base_rate' => $rates->rate,
        'feature_rate' => $rates->feature_rate,
        'social_share_rate' => $rates->social_share_rate
    ]);
});

Route::post('/contact', function (Request $request) {
  $validated = $request->validate([
      'name' => 'nullable|string|max:255',
      'email' => 'required|email|max:255',
      'message' => 'required|string|max:2000'
  ]);
  // Store in database
  GuestMessage::create($validated);
  return response()->json(['message' => 'Contact form submitted successfully']);

});
Route::get('/auth/google', [AuthController::class, 'handleGoogleLogin']);
Route::get('/proxy/horoscope', [FrontendController::class, 'horoscopeProxy']);
Route::get('/horoscope-content', [FrontendController::class, 'horoscopeContent']);
Route::get('/get/inspire', [FrontendController::class, 'getQuote']);
Route::get('/get/top-header-banner', [BannerController::class, 'getTopBanner']);
Route::get('/get/spot-2-banners', [BannerController::class, 'getSpot2Banners']);
Route::get('/banners/spot-3', [BannerController::class, 'getSpot3Banners']);
Route::get('/banners/spot-4', [BannerController::class, 'getSpot4Banners']);
Route::get('/banners/spot-5', [BannerController::class, 'getSpot5Banners']);
Route::get('/banners/spot-6', [BannerController::class, 'getSpot6Banners']);

Route::get('/banner-categories', function () {
    return BannerCategory::all();
});

// routes/api.php

// Banner Rates
Route::get('/banner/rates', function () {
    return response()->json([
        'base_rate' => 50 // Default rate, customize as needed
    ]);
});

// Final Banner Payment Processing
Route::post('/banner/final/post', function (Request $request) {
    dd($request->all());
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
        $banner->customer_email = $request->bannerData['customer_email'];
        $banner->expire_date = Carbon::now()->addDays((int)$request->bannerData['expire_date']);
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
});

Route::post('/save-draft', [DraftController::class, 'store']);
Route::post('/get-draft', [DraftController::class, 'getDraft']);
Route::post('/drafts/{id}/confirm', [DraftController::class, 'confirmDraftUsage']);
Route::post('/session/init', [DraftController::class, 'initSession']);
// Protected Routes
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/get/directory/categories', [DirectoryController::class, 'getDirectoryCategories']);
Route::get('/get/directory/category/{id}', [DirectoryController::class, 'getDirectoryCategory']);
Route::get('/get/directory/sub/categories/{id}', [DirectoryController::class, 'getDirectorySubCategories']);
Route::get('/directory/rate', [DirectoryController::class, 'getDirectoryRate']);
// Authenticate Routes
Route::middleware('auth:sanctum')->group(function () {
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::post('/update-profile', [AuthController::class, 'updateProfile']);
  Route::get('/user/profile', [AuthController::class, 'getProfile']);
  Route::post('/change-password', [AuthController::class, 'changePassword']);
  Route::post('/add/products', [ProductController::class, 'store']);
  Route::get('/products', [ProductController::class, 'products']);
  Route::get('/product/{id}', [ProductController::class, 'show']);
  Route::delete('/delete/products/{id}', [ProductController::class, 'destroy']);
  Route::get('/admin/users', [UserController::class, 'users']);
  Route::post('/user/create', [UserController::class, 'create']);
  Route::post('/user/edit/{id}', [UserController::class, 'edit']);
  Route::delete('/user/delete/{id}', [UserController::class, 'delete']);
  Route::get('/admin/ad-subcategories', [FrontendController::class, 'getAdSubCategories']);
  Route::get('/admin/ad-categories', [FrontendController::class, 'getAdCategories']);
  Route::get('/admin/directory/rates', [DirectoryController::class, 'getDirectoryRates']);
  Route::post('/admin/update-directory-rates/{id}', [DirectoryController::class, 'updateDirectoryRate']);
  Route::post('/admin/update-subcategories/{type}/{id}', [FrontendController::class, 'updateRate']);
  Route::post('/send-message', [ChatController::class, 'sendMessage']);
  Route::get('/messages/{userId}', [ChatController::class, 'getMessages']);
  Route::get('/active-admins', [ChatController::class, 'getActiveAdmins']);

  Route::get('/admin/conversations', [ChatController::class, 'getConversations']);
  Route::get('/admin/messages/{userId}', [ChatController::class, 'getAdminMessages']);
  Route::post('/admin/send-message', [ChatController::class, 'sendAdminMessage']);
  Route::post('/admin/messages/mark-read/{userId}', [ChatController::class, 'markAsRead']);
  Route::get('/current-user', function () {
      return response()->json([
          'id' => Auth::user()->id,
          'name' => Auth::user()->name,
          // other user data you need
      ]);
  });

  Route::get('/user/posts', function(){
    $posts = \App\Models\JobOffer::where('user_id', Auth::user()->id)->where('is_verified', 1)->get();
    // dd($posts);
    return response()->json([
        'posts' => $posts
    ]);
  });
  Route::get('/user/post/edit/{id}', function($id) {
    $post = \App\Models\JobOffer::with('images')
        ->where('user_id', Auth::id())
        ->where('id', $id)
        ->where('is_verified', 1)
        ->firstOrFail();

    // Transform images collection
    $post->images_url = $post->images->map(function($image) {
        return [
            'url' => asset("jobOffers/attachments/{$image->image_path}"),
            'name' => $image->original_name,
            'type' => pathinfo($image->image_path, PATHINFO_EXTENSION)
        ];
    });

    return response()->json([
        'post' => $post
    ]);
  });

  Route::get('/admin/notifications', [NotificationController::class, 'index']);
  Route::post('/admin/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
  Route::post('/posts/{id}/verify', [PostPermissionController::class, 'verify']);
  Route::get('/admin/get/un-verified/post/{model}/{id}', [PostPermissionController::class, 'getUnVerifiedPost']);
  Route::get('/admin/ads/history', [FrontendController::class, 'adsHistory']);
  // Route::resource('/home/blogs', BlogController::class);
  Route::get('/admin/blogs', [BlogController::class, 'index']);
  Route::get('/blog/{id}', [BlogController::class, 'show']);
  Route::post('/admin/blog/store', [BlogController::class, 'store']);
  Route::post('/admin/blog/edit/{id}', [BlogController::class, 'update']);
  Route::delete('/admin/blog/delete/{id}', [BlogController::class, 'destroy']);
});
Route::get('/user/blogs', [BlogController::class, 'allBlog']);
Route::post('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);
Route::get('/products/lists', [ProductController::class, 'productsList']);

// Google
Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle']);

Route::get('/sanctum/csrf-cookie', function () {
  return response()->noContent();
});

Route::get('/home-videos', function() {
  $videos = HomeVideo::all();
  return response()->json([
      'data' => $videos
  ]);
});

Route::get("checkHoroscope", function(Request $request){
  return response()->json(['session' => $request->input('src')]);
})->name('checkHoroscope');

Route::get('/job-offers-list', [JobOfferController::class, 'getJobOfferslist']);

Route::get('/{any}', function () {
  return view('welcome');
})->where('any', '.*');

