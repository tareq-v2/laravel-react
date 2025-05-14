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

    public function updateRate(Request $request, $id)
    {   
        $request->validate([
            'rate' => 'required|string' // Changed to accept string values
        ]);
        // dd($request->all(), $id);
        // Convert numeric strings to float, keep 'free' as is
        $rate = $request->rate;
        $data = AdSubCategory::find($id);
        if ($rate !== 'free' && is_numeric($rate)) {
            $rate = (float)$rate;
            
            $data->rate = $rate;
            $data->save();
        }else{
            $data->rate = $rate;
            $data->save();
        }
        

        return response()->json([
            'success' => true,
            'message' => 'Rate updated successfully',
            'data' => $data
        ]);
    }

}
