<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobOffer extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'expire_date' => 'datetime',
        'featured_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    protected $dates = [
        'expire_date',
        'featured_at',
        'created_at'
    ];
    public function images()
    {
        return $this->hasMany(JobOfferImage::class);
    }

    public function getImagesUrlAttribute()
    {
        return $this->images->map(function($image) {
            return [
                'url' => asset("jobOffers/attachments/{$image->image_path}"),
                'name' => $image->original_name,
                'type' => pathinfo($image->image_path, PATHINFO_EXTENSION)
            ];
        });
    }
    
}
