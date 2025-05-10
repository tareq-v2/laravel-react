<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DirectoryController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\FrontendController;
use App\Http\Middleware\CorsMiddleware;
use Illuminate\Support\Facades\Artisan;
use App\Models\HomeVideo;
use Illuminate\Http\Request;
use App\Models\GuestMessage;
use App\Models\JobOfferCategory;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('ad/category/icons', [FrontendController::class, 'categoryIcons']);
Route::get('ad/sub/category/icons/{id}', [FrontendController::class, 'subCategoryIcons']);
Route::get('directory/category/icons', [DirectoryController::class, 'categoryIcons']);
Route::post('job-offers-post', [FrontendController::class, 'jobOfferPost']);

Route::get('/job-offer-categories', function() {
    $categories = \App\Models\JobOfferCategory::all();
    return array_chunk($categories->toArray(), ceil($categories->count() / 4));
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
// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::post('/add/products', [ProductController::class, 'store']);
  Route::get('/products', [ProductController::class, 'products']);
  Route::get('/product/{id}', [ProductController::class, 'show']);
  Route::delete('/delete/products/{id}', [ProductController::class, 'destroy']);
});

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
Route::get('/{any}', function () {
  return view('welcome');
})->where('any', '.*');

