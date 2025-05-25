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
                'title' => 'Cartoon One',
                'video_link' => 'https://www.youtube.com/embed/5oH9Nr3bKfw',
                'video_thumbnail' => 'http://localhost:8000/storage/banners/video_thumbnail1.png'
            ],
            [
                'title' => 'Cartoon Two',
                'video_link' => 'https://www.youtube.com/embed/63O7X1BrH7E',
                'video_thumbnail' => 'http://localhost:8000/storage/banners/video_thumbnail2.png'
            ],
            [
                'title' => 'Cartoon Three',
                'video_link' => 'https://www.youtube.com/embed/pPbf-eVGS6E',
                'video_thumbnail' => 'http://localhost:8000/storage/banners/video_thumbnail3.png'
            ],
            [
                'title' => 'Cartoon Four',
                'video_link' => 'https://www.youtube.com/embed/l1JHzFV7ROo',
                'video_thumbnail' => 'http://localhost:8000/storage/banners/video_thumbnail4.png'
            ],
            [
                'title' => 'Cartoon Five',
                'video_link' => 'https://www.youtube.com/embed/mWXrM-OKBNQ',
                'video_thumbnail' => 'http://localhost:8000/storage/banners/video_thumbnail5.png'
            ],
            [
                'title' => 'Cartoon Six',
                'video_link' => 'https://www.youtube.com/embed/4gLFlQUOHJw',
                'video_thumbnail' => 'http://localhost:8000/storage/banners/video_thumbnail6.png'
            ],
            [
                'title' => 'Cartoon Seven',
                'video_link' => 'https://www.youtube.com/embed/DgDIrZX0Re8',
                'video_thumbnail' => 'http://localhost:8000/storage/banners/video_thumbnail7.png'
            ],
            [
                'title' => 'Cartoon Eight',
                'video_link' => 'https://www.youtube.com/embed/kxDd03SJdkM',
                'video_thumbnail' => 'http://localhost:8000/storage/banners/video_thumbnail8.png'
            ],
        ];
        HomeVideo::truncate(); // Clear the table before seeding
        foreach ($videos as $video) {
            HomeVideo::create($video);
        }
    }
}
