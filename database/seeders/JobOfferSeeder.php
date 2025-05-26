<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JobOffer;
use Carbon\Carbon;

class JobOfferSeeder extends Seeder
{
    public function run()
    {
        JobOffer::truncate(); 
        $now = Carbon::now();
        $totalJobs = 45;

        // Create random job offers
        for ($i = 0; $i < $totalJobs; $i++) {
            $isFeatured = rand(1, 100) <= 30; // 30% chance to be featured
            $createdAt = $now->copy()->subDays(rand(0, 30))->subHours(rand(0, 23));
            $expireDate = $createdAt->copy()->addDays(30);

            $jobData = [
                'created_at' => $createdAt,
                'expire_date' => $expireDate,
            ];

            if ($isFeatured) {
                // Feature within last 24 hours of creation
                $featuredAt = $createdAt->copy()->addHours(rand(0, 24));
                $jobData['feature'] = 'Yes';
                $jobData['featured_at'] = $featuredAt->isAfter($now) ? $now : $featuredAt;
            } else {
                // 10% chance of expired featured post
                $jobData['feature'] = 'No';
                if (rand(1, 100) <= 10) {
                    $jobData['featured_at'] = $createdAt->copy()->subHours(rand(25, 48));
                }
            }

            JobOffer::factory()->create($jobData);
        }

        // Create specific test cases
        $this->createSpecificTestCases($now);
    }

    protected function createSpecificTestCases(Carbon $now)
    {
        // Recent featured posts
        JobOffer::factory()->create([
            'title' => '🔥 Senior Laravel Developer (Featured)',
            'feature' => 'Yes',
            'featured_at' => $now->copy()->subHours(2),
            'created_at' => $now->copy()->subDays(5),
            'expire_date' => $now->copy()->addDays(25),
        ]);

        JobOffer::factory()->create([
            'title' => '🚀 React Frontend Lead (Featured)',
            'feature' => 'Yes',
            'featured_at' => $now->copy()->subHours(5),
            'created_at' => $now->copy()->subDays(10),
            'expire_date' => $now->copy()->addDays(20),
        ]);

        // Expired featured post (should be demoted)
        JobOffer::factory()->create([
            'title' => '💀 Legacy Featured Post (Expired)',
            'feature' => 'Yes',
            'featured_at' => $now->copy()->subHours(25),
            'created_at' => $now->copy()->subDays(15),
            'expire_date' => $now->copy()->addDays(15),
        ]);

        // Non-featured with expired feature history
        JobOffer::factory()->create([
            'title' => '📉 Previously Featured Post',
            'feature' => 'No',
            'featured_at' => $now->copy()->subHours(30),
            'created_at' => $now->copy()->subDays(20),
            'expire_date' => $now->copy()->addDays(10),
        ]);

        // Newest non-featured
        JobOffer::factory()->create([
            'title' => '🆕 Brand New Job Post',
            'feature' => 'No',
            'created_at' => $now->copy()->subHour(),
            'expire_date' => $now->copy()->addDays(29),
        ]);
    }
}