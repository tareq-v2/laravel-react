<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DirectoryCategory;

class DirectoryCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        DirectoryCategory::truncate();
        DirectoryCategory::create([
            'name' => 'Appliance Sales & Repair',
            'icon' => 'car-repair.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Automotive',
            'icon' => 'electric-car.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Beauty & Salon Services',
            'icon' => 'Beauty-&-Salon-Services.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Cleaning & Sanitation',
            'icon' => 'sanitary.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Clubs & Organizations',
            'icon' => 'clubhouse.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Computers, Phones & Electronics',
            'icon' => 'monitor.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Community Services',
            'icon' => 'community.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Construction',
            'icon' => 'construction.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Financial & Tax Services',
            'icon' => 'finance.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Food & Beverages',
            'icon' => 'food.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Government',
            'icon' => 'government.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Health & Medical Services',
            'icon' => 'healthcare.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Home Repair Services',
            'icon' => 'home-repair.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Insurance Services',
            'icon' => 'insurance.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Legal Services',
            'icon' => 'legal.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Moving & Transportation',
            'icon' => 'transportation.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Pet Services',
            'icon' => 'pet.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Printing, Designing & Branding',
            'icon' => 'printer.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Real Estate Services',
            'icon' => 'real-estate.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Religion',
            'icon' => 'religion.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Retail Stores & Shopping',
            'icon' => 'retailStore.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Schools, Education & Child Care',
            'icon' => 'education.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Social Services',
            'icon' => 'social-services.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Special Event Services',
            'icon' => 'event.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Sports & Recreation',
            'icon' => 'sports.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Travel & Hospitality',
            'icon' => 'travels.png',
            'status' => 0
        ]);
        DirectoryCategory::create([
            'name' => 'Website & Marketing',
            'icon' => 'developer.png',
            'status' => 0
        ]);
        
    }
}
