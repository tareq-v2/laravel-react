<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdCategory extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $appends = ['icon_path'];

    public function getIconPathAttribute()
    {
        return asset("storage/categoryIcons/{$this->icon}");
    }
}
