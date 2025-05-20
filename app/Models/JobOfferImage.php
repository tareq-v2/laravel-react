<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobOfferImage extends Model
{
    protected $table = 'job_offer_images';
    protected $fillable = ['job_offer_id', 'image_path', 'type', 'original_name'];
}
