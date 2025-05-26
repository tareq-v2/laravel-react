<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\JobOffer;
use Carbon\Carbon;

class JobOfferFactory extends Factory
{
    protected $model = JobOffer::class;

    public function definition()
    {
        $now = Carbon::now();
        
        return [
            'title' => $this->faker->jobTitle,
            'user_id' => null,
            'city' => $this->faker->city,
            'category' => $this->faker->randomElement(['IT', 'Finance', 'Healthcare']),
            'description' => $this->faker->paragraph,
            'salary' => '$'.rand(30000, 100000),
            'email' => $this->faker->safeEmail,
            'is_verified' => 1,
            'created_at' => $now->subDays(rand(1, 30)),
            'expire_date' => $now->copy()->addDays(30),
            'feature' => 'No',
            'featured_at' => null,
        ];
    }
}