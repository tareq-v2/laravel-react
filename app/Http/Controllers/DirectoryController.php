<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DirectoryCategory;
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
    
}
