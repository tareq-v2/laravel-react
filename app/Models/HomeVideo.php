<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeVideo extends Model
{
    protected $fillable = [
        'title',
        'description',
        'video_url',
        'thumbnail_url',
        'published_at',
    ];
    protected $guarded = []; // Use guarded to allow mass assignment for all fields
}
