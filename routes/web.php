<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Auth\SocialAuthController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::post('/add/products', [ProductController::class, 'store']);
  Route::get('/products', [ProductController::class, 'products']);
  Route::get('/product/{id}', [ProductController::class, 'show']);
  Route::delete('/delete/products/{id}', [ProductController::class, 'destroy']);
});

Route::get('/products/lists', [ProductController::class, 'productsList']);


// Google
Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

// Facebook
// Route::get('/auth/facebook', [SocialAuthController::class, 'redirectToFacebook']);
// Route::get('/auth/facebook/callback', [SocialAuthController::class, 'handleFacebookCallback']);

Route::get('/{any}', function () {
  return view('welcome');
})->where('any', '.*');

