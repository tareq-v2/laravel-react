<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DirectorySubCategory extends Model
{
    protected $guarded = [];

    public function category()
    {
        return $this->belongsTo(DirectoryCategory::class);
    }
}
