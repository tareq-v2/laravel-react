<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdSubCategory extends Model
{
    use HasFactory;

    protected $table = 'ad_sub_categories';

    protected $fillable = [
        'category_id',
        'name',
        'icon',
        'active_status',
        'order'
    ];

    // Add this to handle the reserved keyword 'order'
    protected $casts = [
        'order' => 'integer'
    ];

    public function category()
    {
        return $this->belongsTo(AdCategory::class, 'category_id');
    }
}
