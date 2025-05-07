<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdCategory extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $appends = ['icon_path'];
    // In AdCategory.php
    public function getIconPathAttribute()
    {
        return $this->icon ? asset("storage/{$this->icon}") : null;
    }

    protected $table = 'ad_categories'; // Ensure this matches your categories table name

    // Define relationship with subcategories
    public function subCategories()
    {
        return $this->hasMany(AdSubCategory::class, 'category_id');
    }
}


