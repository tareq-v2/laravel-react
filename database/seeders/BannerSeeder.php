<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Banner;
use Carbon\Carbon;

class BannerSeeder extends Seeder
{
    public function run(): void
    {  
        Banner::truncate();
        Banner::query()->delete();

        // Spot 1
        Banner::create([
            'user_id' => null,
            'images' => 'spot-1-1.png',
            'spot' => 1,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 1,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);

        Banner::create([
            'images' => 'spot-1-2.png',
            'spot' => 1,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 1,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);

        // Spot 2
        Banner::create([
            'images' => 'spot-2-1.png',
            'spot' => 2,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 2,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);

        Banner::create([
            'images' => 'spot-2-2.png',
            'spot' => 2,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 2,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);
        
        // Spot 3
        Banner::create([
            'images' => 'spot-3-1.png',
            'spot' => 3,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 3,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);

        Banner::create([
            'images' => 'spot-3-2.png',
            'spot' => 3,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 3,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);

        // Spot 4
        Banner::create([
            'images' => 'spot-4-1.png',
            'spot' => 4,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 4,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);

        Banner::create([
            'images' => 'spot-4-2.png',
            'spot' => 4,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 4,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);

        // Spot 5
        Banner::create([
            'images' => 'spot-5-1.png',
            'spot' => 5,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 5,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);
        
        Banner::create([
            'images' => 'spot-5-2.png',
            'spot' => 5,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 5,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);
        
        // Spot 6
        Banner::create([
            'images' => 'spot-6-1.png',
            'spot' => 6,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 6,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);

        Banner::create([
            'images' => 'spot-6-2.png',
            'spot' => 6,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 6,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);

        // Spot 7
        Banner::create([
            'images' => 'spot-7-1.png',
            'spot' => 7,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 7,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);

        Banner::create([
            'images' => 'spot-7-2.png',
            'spot' => 7,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 7,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);

        // Spot 8
        Banner::create([
            'images' => 'spot-8-1.png',
            'spot' => 8,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 8,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);

        Banner::create([
            'images' => 'spot-8-2.png',
            'spot' => 8,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 8,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);

        // Spot 9
        Banner::create([
            'images' => 'spot-9-1.png',
            'spot' => 9,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 9,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);

        Banner::create([
            'images' => 'spot-9-2.png',
            'spot' => 9,
            'external_link' => 'https://www.youtube.com/',
            'banner_category_id' => 9,
            'payment_status' => 1,
            'status' => 1,
            'expire_period' => 60,
            'user_id' => null,
            'expire_date' => Carbon::now()->addDays(60)->toDateString(),
            'override' => true,
        ]);
    }
}
