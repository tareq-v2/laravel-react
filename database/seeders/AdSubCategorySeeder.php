<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AdSubCategory;

class AdSubCategorySeeder extends Seeder
{
    public function run(): void
    {
        AdSubCategory::truncate();
        AdSubCategory::create([
            'category_id' => 1,
            'name' =>  'Jobs Offered (Hiring)',
            'icon' => 'businessman.png',
            'active_status' => 'Yes',
            'order' => 1
        ]);
        AdSubCategory::create([
            'category_id' => 1,
            'name' =>  'Jobs Wanted (Résumé)',
            'icon' => 'job-seeker.png',
            'active_status' => 'Yes',
            'order' => 2
        ]);
        AdSubCategory::create([
            'category_id' => 2,
            'name' =>  'Apt/House For Rent',
            'icon' => 'house-rent.png',
            'active_status' => 'Yes',
            'order' => 3
        ]);
        AdSubCategory::create([
            'category_id' => 2,
            'name' =>  'Housing Wanted',
            'icon' => 'housing-rent.png',
            'active_status' => 'Yes',
            'order' => 4
        ]);
        AdSubCategory::create([
            'category_id' => 2,
            'name' =>  'Roommates/Shared',
            'icon' => 'roommate-rent.png',
            'active_status' => 'Yes',
            'order' => 5
        ]);
        AdSubCategory::create([
            'category_id' => 2,
            'name' =>  'Office/Commercial For Rent',
            'icon' => 'commercial-rent.png',
            'active_status' => 'Yes',
            'order' => 6
        ]);
        AdSubCategory::create([
            'category_id' => 2,
            'name' =>  'Vacation Rentals',
            'icon' => 'vacation-rent.png',
            'active_status' => 'Yes',
            'order' => 7
        ]);
        AdSubCategory::create([
            'category_id' => 2,
            'name' =>  'Armenia Rentals',
            'icon' => 'armenian-rent.png',
            'active_status' => 'Yes',
            'order' => 8
        ]);
        AdSubCategory::create([
            'category_id' => 2,
            'name' =>  'International Rentals',
            'icon' => 'global-rent.png',
            'active_status' => 'Yes',
            'order' => 9
        ]);
        AdSubCategory::create([
            'category_id' => 2,
            'name' =>  'Other Rentals',
            'icon' => 'other-rent.png',
            'active_status' => 'Yes',
            'order' => 10
        ]);
        AdSubCategory::create([
            'category_id' => 4,
            'name' =>  'Cars For Sale',
            'icon' => 'buy.png',
            'active_status' => 'Yes',
            'order' => 11
        ]);
        AdSubCategory::create([
            'category_id' => 4,
            'name' =>  'Cars For Lease/Rent',
            'icon' => 'global-rent.png',
            'active_status' => 'Yes',
            'order' => 12
        ]);
        AdSubCategory::create([
            'category_id' => 5,
            'name' =>  'Homes For Sale',
            'icon' => 'home-for-sell.png',
            'active_status' => 'Yes',
            'order' => 13
        ]);
        AdSubCategory::create([
            'category_id' => 5,
            'name' =>  'Investment Properties',
            'icon' => 'town-home.png',
            'active_status' => 'Yes',
            'order' => 14
        ]);
        AdSubCategory::create([
            'category_id' => 5,
            'name' =>  'Land For Sale',
            'icon' => 'land.png',
            'active_status' => 'Yes',
            'order' => 15
        ]);
        AdSubCategory::create([
            'category_id' => 5,
            'name' =>  'Commercial Real Estate',
            'icon' => 'market.png',
            'active_status' => 'Yes',
            'order' => 16
        ]);
        AdSubCategory::create([
            'category_id' => 5,
            'name' =>  'Vacation Homes',
            'icon' => 'vacation-home.png',
            'active_status' => 'Yes',
            'order' => 17
        ]);
        AdSubCategory::create([
            'category_id' => 5,
            'name' =>  'Time Share',
            'icon' => 'time-shares.png',
            'active_status' => 'Yes',
            'order' => 18
        ]);
        AdSubCategory::create([
            'category_id' => 5,
            'name' =>  'Real Estate in Armenia',
            'icon' => 'hook.png',
            'active_status' => 'Yes',
            'order' => 19
        ]);
        AdSubCategory::create([
            'category_id' => 5,
            'name' =>  'International Real Estate',
            'icon' => 'international-real-estate.png',
            'active_status' => 'Yes',
            'order' => 20
        ]);
        AdSubCategory::create([
            'category_id' => 7,
            'name' =>  'Events/Entertainment',
            'icon' => 'event.png',
            'active_status' => 'Yes',
            'order' => 22
        ]);
        AdSubCategory::create([
            'category_id' => 7,
            'name' =>  'Travel',
            'icon' => 'travel.png',
            'active_status' => 'Yes',
            'order' => 21
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Birds',
            'icon' => 'birds.png',
            'active_status' => 'Yes'
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Cats',
            'icon' => 'cat.png',
            'active_status' => 'Yes',
            'order' => 23
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Dogs',
            'icon' => 'dog.png',
            'active_status' => 'Yes',
            'order' => 24
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Fishes',
            'icon' => 'fish.png',
            'active_status' => 'Yes',
            'order' => 25
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Free Pets to Good Home',
            'icon' => 'pet-friendly.png',
            'active_status' => 'Yes',
            'order' => 26
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Horses',
            'icon' => 'horse.png',
            'active_status' => 'Yes',
            'order' => 27
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Livestock',
            'icon' => 'livestock.png',
            'active_status' => 'Yes',
            'order' => 28
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Pets Lost & Found',
            'icon' => 'finding.png',
            'active_status' => 'Yes',
            'order' => 29
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Pets Wanted',
            'icon' => 'pet-house.png',
            'active_status' => 'Yes',
            'order' => 30
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Reptiles',
            'icon' => 'pet-house.png',
            'active_status' => 'Yes',
            'order' => 31
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Other',
            'icon' => 'other-pets.png',
            'active_status' => 'Yes',
            'order' => 32
        ]);
        AdSubCategory::create([
            'category_id' => 11,
            'name' =>  'Professional Connect',
            'icon' => 'professional.png',
            'active_status' => 'Yes',
            'order' => 33
        ]);
        AdSubCategory::create([
            'category_id' => 11,
            'name' =>  'Hobbies & Interests Connect',
            'icon' => 'interest.png',
            'active_status' => 'Yes',
            'order' => 34
        ]);
        AdSubCategory::create([
            'category_id' => 3,
            'name' => 'Local Services Los Angeles',
            'icon' => 'lc_los_angeles.png',
            'active_status' => 'Yes',
            'order' => 35
        ]);
        AdSubCategory::create([
            'category_id' => 3,
            'name' => 'Local Services Armenia',
            'icon' => 'lc_armenia.png',
            'active_status' => 'Yes',
            'order' => 36
        ]);
        AdSubCategory::create([
            'category_id' => 12,
            'name' => 'Food Delivery & Takeout',
            'icon' => 'food_delevery_takeout.png',
            'active_status' => 'Yes',
            'order' => 37
        ]);
        AdSubCategory::create([
            'category_id' => 12,
            'name' => 'Pastries, Delicacies, & Catering',
            'icon' => 'pastries.png',
            'active_status' => 'Yes',
            'order' => 38
        ]);
        AdSubCategory::create([
            'category_id' => 12,
            'name' => 'Restaurants & Fine Dining',
            'icon' => 'restaurant_fine.png',
            'active_status' => 'Yes',
            'order' => 39
        ]);
        AdSubCategory::create([
            'category_id' => 4,
            'name' => 'Car Parts & Accessories',
            'icon' => 'car_part_accessories.png',
            'active_status' => 'Yes',
            'order' => 40
        ]);
    }
}
