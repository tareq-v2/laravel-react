<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AdCategory;
use Illuminate\Support\Facades\DB;

class AdCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AdCategory::create([
            'name' => 'Jobs',
            'icon' => 'jobs.png',
            'active_status' => 'Yes'
        ]);
        AdCategory::create([
            'name' => 'For Rent',
            'icon' => 'rent.png',
            'active_status' => 'Yes'
        ]);
        AdCategory::create([
            'name' => 'Local Services',
            'icon' => 'localization.png',
            'active_status' => 'Yes'
        ]);
        AdCategory::create([
            'name' => 'Cars',
            'icon' => 'electric-car.png',
            'active_status' => 'Yes'
        ]);
        AdCategory::create([
            'name' => 'Real Estate',
            'icon' => 'real-estate.png',
            'active_status' => 'Yes'
        ]);
        AdCategory::create([
            'name' => 'Business For Sale',
            'icon' => 'businessess.png',
            'active_status' => 'Yes'
        ]);
        AdCategory::create([
            'name' => 'Travel & Entertainment',
            'icon' => 'travels.png',
            'active_status' => 'Yes'
        ]);
        AdCategory::create([
            'name' => 'Items For Sale',
            'icon' => 'item-for-sale.png',
            'active_status' => 'Yes'
        ]);
        AdCategory::create([
            'name' => 'Pets',
            'icon' => 'pet.png',
            'active_status' => 'Yes'
        ]);
        AdCategory::create([
            'name' => 'Volunteer',
            'icon' => 'volunteer.png',
            'active_status' => 'Yes'
        ]);
        AdCategory::create([
            'name' => 'Armenian Connect',
            'icon' => 'connect.png',
            'active_status' => 'Yes'
        ]);
        AdCategory::create([
            'name' => 'Food & Beverage',
            'icon' => 'food-beverage.png',
            'active_status' => 'Yes'
        ]);
    }
}
