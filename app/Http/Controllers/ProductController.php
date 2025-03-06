<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'imageUrl' => 'nullable|url',
        ]);

        // If validation fails, return a 422 response with errors
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Create the product
        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'image_url' => $request->imageUrl,
        ]);

        // Return a success response
        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product,
        ], 201);
    }

    public function products() {
        
        $products = Product::orderBy('created_at', 'asc')->get();
        // dd($products);
        // Transform the data to match the expected format
        // $transformedProducts = $products->map(function ($product) {
        //     return [
        //         'id' => $product->id,
        //         'name' => $product->name,
        //         'description' => $product->description,
        //         'price' => $product->price,
        //         'imageUrl' => $product->image_url, // Map image_url to imageUrl
        //     ];
        // });
    
        return response()->json($products);
    }
    public function productList() {
        $products = Product::all();
    
        // Transform the data to match the expected format
        $transformedProducts = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'imageUrl' => $product->image_url, // Map image_url to imageUrl
            ];
        });
    
        return response()->json($transformedProducts);
    }

    public function show($id)
    {
        $product = Product::find($id); // Fetch the product by ID
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        return response()->json($product);
    }

    public function destroy(Request $request, $id){
        try {
            dd($request->all(), $id);
            $product->delete();
            return response()->json(['message' => 'Product deleted successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting product',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
