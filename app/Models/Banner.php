<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'user_id',
        'spot',
        'images',
        'external_link',
        'customer_email',
        'expire_date',
        'override',
        'payment_status',
        'status',
        'card_holder_name',
        'street',
        'city',
        'state',
        'zip',
        'country',
        'phone',
        'email',
        'amount',
    ];
}
