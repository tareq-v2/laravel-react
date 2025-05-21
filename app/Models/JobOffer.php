<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobOffer extends Model
{
    protected $guarded = [];

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
