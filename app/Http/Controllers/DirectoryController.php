<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DirectoryCategory;
use App\Models\DirectoryRate;
use App\Models\DirectorySubCategory;
use Directory;

class DirectoryController extends Controller
{
    public function categoryIcons(){
        $categories = DirectoryCategory::all();
        // dd($categories);
        return response()->json([
            'data' => $categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'icon' => asset('storage/'.$category->icon),
                ];
            })
        ]);
    }

    public function getDirectoryCategories(){
        $categories = DirectoryCategory::all();

        if ($categories->isNotEmpty()) {
            return response()->json([
                'success' => true,
                'categories' => $categories
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No active category found.'
        ]);
    }
    
    public function getDirectoryCategory($id)
    {
        $category = DirectoryCategory::find($id);
        
        return response()->json([
            'success' => $category ? true : false,
            'category' => $category
        ]);
    }

    public function getDirectorySubCategories($id){
        $categories = DirectorySubCategory::where('category_id', $id)->get();

        if ($categories->isNotEmpty()) {
            return response()->json([
                'success' => true,
                'subCategories' => $categories
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No active category found.'
        ]);
    }

    public function getDirectoryRates(){
        return response()->json([
            'success' => true,
            'data' => DirectoryRate::all()
        ]);
    }

    public function updateDirectoryRate($id, Request $request)
    {
        // Validate input
        $request->validate([
            'value' => 'required|string'
        ]);

        $value = strtolower(trim($request->value));
        $updateValue = null;

        // Handle free option
        if ($value === 'free') {
            $updateValue = 'free';
        } 
        // Handle numeric values
        else if (is_numeric($value)) {
            $updateValue = number_format((float)$value, 2, '.', '');
        } 
        // Invalid value
        else {
            return response()->json([
                'success' => false,
                'message' => 'Value must be a number or "free"'
            ], 400);
        }

        // Update the rate
        $rate = DirectoryRate::find($id);
        if (!$rate) {
            return response()->json([
                'success' => false,
                'message' => 'Directory rate not found'
            ], 404);
        }

        $rate->amount = $updateValue;
        $rate->save();

        return response()->json([
            'success' => true,
            'message' => 'Rate updated successfully'
        ]);
    }

    public function getDirectoryRate()
    {
        // Fetch all rates
        $rates = DirectoryRate::all();
        
        // Initialize default values
        $baseRate = 75;
        $featureRate = 35;
        $socialRate = 25;
        $extendedRate = 10;
        
        // Map rates from database
        foreach ($rates as $rate) {
            switch ($rate->category) {
                case 'Normal Fee':
                    $baseRate = (float)$rate->amount;
                    break;
                case 'Premium Fee':
                    $featureRate = (float)$rate->amount;
                    break;
                case 'Extend Sub Category Fee':
                    $extendedRate = (float)$rate->amount;
                    break;
                case 'Sub Category Feature Fee':
                    $socialRate = (float)$rate->amount;
                    break;
            }
        }
        
        return response()->json([
            'success' => true,
            'base_rate' => $baseRate,
            'feature_rate' => $featureRate,
            'social_share_rate' => $socialRate,
            'extended_rate' => $extendedRate
        ]);
    }
    
}
