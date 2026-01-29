<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FocusFlow extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'priority',
        'order',
        'completed',
        'focus_time',
        'notes'
    ];

    protected $casts = [
        'completed' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
