<?php

namespace App\Http\Controllers;

use App\Models\AdCategory;
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
}
