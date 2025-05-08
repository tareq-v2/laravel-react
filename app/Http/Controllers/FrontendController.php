<?php

namespace App\Http\Controllers;

use App\Models\AdCategory;
use App\Models\AdSubCategory;
use Illuminate\Http\Request;

class FrontendController extends Controller
{
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
        $subCategories = AdSubCategory::where('category_id', $id)->get();
        if($subCategories){
            return response()->json([
                'data' => $subCategories->map(function ($subCategory) {
                    return [
                        'id' => $subCategory->id,
                        'name' => $subCategory->name,
                        'icon' => $subCategory->icon,
                        'route' => $subCategory->route,
                    ];
                })
            ]);
        }else{
            return response()->json([
                'data' => 'Nothing found'
            ]);
        }
    }
}
