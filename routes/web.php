<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::post('/add/products', [ProductController::class, 'store']);
  Route::get('/products', [ProductController::class, 'products']);
  Route::get('/product/{id}', [ProductController::class, 'show']);
  Route::post('/delete/products/{id}', [ProductController::class, 'delete']);
});

// Route::post('/logout', [AuthController::class, 'logout']);
// Route::post('/add/products', [ProductController::class, 'store']);
// // Route::get('/products', [ProductController::class, 'products']);
// Route::get('/api/products', [ProductController::class, 'products']);
// Route::get('/product/{id}', [ProductController::class, 'show']);

Route::get('/products/lists', [ProductController::class, 'productsList']);

Route::get('/{any}', function () {
  return view('welcome');
})->where('any', '.*');

