<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Directory extends Model
{
    protected $guarded = [];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(DirectoryCategory::class);
    }

    public function subCategories()
    {
        return $this->belongsToMany(DirectorySubCategory::class);
    }

    public function images()
    {
        return $this->hasMany(DirectoryImage::class);
    }
}
