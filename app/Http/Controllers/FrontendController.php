<?php

namespace App\Http\Controllers;

use App\Models\AdCategory;
use App\Models\AdSubCategory;
use Illuminate\Http\Request;

class FrontendController extends Controller
{
    public function jobOfferPost(Request $request){
        dd($request->all());
    }
    
    public function categoryIcons(){
        $categories = AdCategory::all();
    
        return response()->json([
            'data' => $categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'icon' => $category->icon_path,
                ];
            })
        ]);
    }

    public function subCategoryIcons($id)
    {
        try {
            $subCategories = AdSubCategory::where('category_id', $id)
                ->whereNotNull('rate')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $subCategories->map(function ($subCategory) {
                    return [
                        'id' => $subCategory->id,
                        'name' => $subCategory->name,
                        'icon' => $subCategory->icon,
                        'route' => $subCategory->route,
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch subcategories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAdSubCategories()
    {
        try {
            $perPage = request('per_page', 10);
            $subcategories = AdSubCategory::whereNotNull('rate')
                ->with('category')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $subcategories->items(),
                'pagination' => [
                    'current_page' => $subcategories->currentPage(),
                    'last_page' => $subcategories->lastPage(),
                    'per_page' => $subcategories->perPage(),
                    'total' => $subcategories->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch subcategories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateRate(Request $request, $type, $id)
    {
        // dd($request->all(), $type, $id);
        $validTypes = ['rate', 'feature-rate', 'social-rate'];
        
        if (!in_array($type, $validTypes)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid rate type'
            ], 400);
        }

        $request->validate([
            'value' => 'required|string|max:255'
        ]);
        
        $fieldMap = [
            'rate' => 'rate',
            'feature-rate' => 'feature_rate',
            'social-rate' => 'social_share_rate'
        ];
        
        $field = $fieldMap[$type];
        $input = strtolower(trim($request->value));
        
        $data = AdSubCategory::findOrFail($id);
        
        if ($input === 'free') {
            $data->$field = 'free';
        } else {
            // Validate numeric value
            if (!is_numeric($input)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid value. Must be numeric or "free"'
                ], 422);
            }
            
            // Store as string but format consistently
            $data->$field = number_format((float)$input, 2, '.', '');
        }
        
        $data->save();

        return response()->json([
            'success' => true,
            'message' => ucfirst($type).' updated successfully',
            'data' => $data
        ]);
    }

}
