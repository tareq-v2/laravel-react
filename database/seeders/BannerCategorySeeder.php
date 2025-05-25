<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BannerCategory;

class BannerCategorySeeder extends Seeder
{
    public function run(): void
    {
        BannerCategory::truncate();

        //  Top Leaderboard
        BannerCategory::create([
            'name' => 'Top Leaderboard',
            // 'size' => '728x90',
            'size' => '700x87',
            'limit' => 25
        ]);
        //  Top Right Ractangle
        BannerCategory::create([
            'name' => 'Top Right Rectangle',
            // 'size' => '456x307',
            'size' => '476x320',
            'limit' => 25
        ]);

        // Right / Left Large
        BannerCategory::create([
            'name' => 'Left/Right Vertical',
            'size' => '176x660',
            'limit' => 25
        ]);

        //  Right /Left Medium
        BannerCategory::create([
            'name' => 'Left/Right Vertical',
            'size' => '176x465',
            'limit' => 25
        ]);

        // Hompe Page Ractangle
        BannerCategory::create([
            'name' => 'Left Vertical',
            // 'size' => '276x465',
            'size' => '276x485',
            'limit' => 25
        ]);

        // General Classified Listing (Horizontal)
        BannerCategory::create([
            'name' => 'Between Horizontal',
            'size' => '1127x139',
            'limit' => 25
        ]);

        // Classified Ad details Banner
        BannerCategory::create([
            'name' => 'Rectangle',
            // 'size' => '376x526',
            'size' => '376x400',
            'limit' => 25
        ]);

        // Ractangle (Inside Classified Listing)
        BannerCategory::create([
            'name' => 'Rectangle',
            'size' => '276x386',
            'limit' => 25
        ]);
        // Business Directory Details page bannner  
        BannerCategory::create([
            'name' => 'Rectangle',
            // 'size' => '376x526',
            'size' => '376x400',
            'limit' => 25
        ]);

        // home video
        BannerCategory::create([
            'name' => 'Video',
            'limit' => 25
        ]);

    }
}
