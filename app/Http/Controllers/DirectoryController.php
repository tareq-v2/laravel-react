<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DirectoryCategory;

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
    
}
