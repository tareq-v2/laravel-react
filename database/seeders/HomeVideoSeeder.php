<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\HomeVideo;

class HomeVideoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $videos = [
            [
                'title' => 'Amazing Nature Scenery',
                'video_link' => 'https://www.youtube.com/embed/kkJjHNKkB98',
                'video_thumbnail' => 'nature-thumb.jpg'
            ],
            [
                'title' => 'City Time Lapse',
                'video_link' => 'https://www.youtube.com/embed/T5Yadh-4ikI',
                'video_thumbnail' => 'city-thumb.jpg'
            ],
            [
                'title' => 'Space Exploration',
                'video_link' => 'https://www.youtube.com/embed/sKSrBe6wLgI',
                'video_thumbnail' => 'space-thumb.jpg'
            ],
        ];
        HomeVideo::truncate(); // Clear the table before seeding
        foreach ($videos as $video) {
            HomeVideo::create($video);
        }
    }
}
