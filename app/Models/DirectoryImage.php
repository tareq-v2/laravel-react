<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DirectoryImage extends Model
{
    protected $guarded = [];
    
    public function directory()
    {
        return $this->belongsTo(Directory::class);
    }
}
