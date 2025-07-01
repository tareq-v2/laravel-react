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

