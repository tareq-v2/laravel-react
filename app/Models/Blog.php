<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = [
        'title',
        'sub_title',
        'slug',
        'image',
        'video_link',
        'description',
        'source',
        'short_description'
    ];
}
