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

        $bannerCategories = [
            [
                'name' => 'Top Leaderboard',
                'display_name' => 'Top Leaderboard (All Pages)',
                'size' => '700x87',
                'limit' => 25,
                'rate' => 10
            ],
            [
                'name' => 'Top Right Rectangle',
                'display_name' => 'Top Right Rectangle (Home Page)',
                'size' => '476x320',
                'limit' => 25,
                'rate' => 10
            ],
            [
                'name' => 'Left/Right Large Vertical',
                'display_name' => 'Left/Right Large Vertical (All Pages)',
                'size' => '176x660',
                'limit' => 25,
                'rate' => 10
            ],
            [
                'name' => 'Left/Right Medium Vertical',
                'display_name' => 'Left/Right Medium Vertical (All Pages)',
                'size' => '176x465',
                'limit' => 25,
                'rate' => 10
            ],
            [
                'name' => 'Home Page Rectangle',
                'display_name' => 'Home Page Rectangle',
                'size' => '276x485',
                'limit' => 25,
                'rate' => 10
            ],
            [
                'name' => 'Between Horizontal',
                'display_name' => 'General Classified Horizontal (Listing Pages)',
                'size' => '1127x139',
                'limit' => 25,
                'rate' => 10
            ],
            [
                'name' => 'Classified Rectangle',
                'display_name' => 'Classified Ad Details Banner',
                'size' => '376x400',
                'limit' => 25,
                'rate' => 10
            ],
            [
                'name' => 'Inside Classified Rectangle',
                'display_name' => 'Inside Classified Rectangle (Listing Pages)',
                'size' => '276x386',
                'limit' => 25,
                'rate' => 10
            ],
            [
                'name' => 'Business Directory Rectangle',
                'display_name' => 'Business Directory Details Banner',
                'size' => '376x400',
                'limit' => 25,
                'rate' => 10
            ],
            [
                'name' => 'Home Video',
                'display_name' => 'Home Page Video',
                'size' => '1920x1080',
                'limit' => 25,
                'rate' => 10
            ]
        ];

        foreach ($bannerCategories as $category) {
            BannerCategory::create($category);
        }
    }
}
