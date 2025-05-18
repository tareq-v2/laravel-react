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
        
        // Category 1: Jobs
        AdSubCategory::create([
            'category_id' => 1,
            'name' =>  'Jobs Offered (Hiring)',
            'icon' => 'businessman.png',
            'active_status' => 'Yes',
            'route' => 'job/offer/list',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 1
        ]);
        AdSubCategory::create([
            'category_id' => 1,
            'name' =>  'Jobs Wanted (Résumé)',
            'icon' => 'job-seeker.png',
            'active_status' => 'Yes',
            'route' => 'job/wanted/resume',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 2
        ]);

        // Category 2: Housing
        AdSubCategory::create([
            'category_id' => 2,
            'name' =>  'Apt/House For Rent',
            'icon' => 'house-rent.png',
            'active_status' => 'Yes',
            'route' => 'housing/apartment-house-rent',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 3
        ]);
        AdSubCategory::create([
            'category_id' => 2,
            'name' =>  'Housing Wanted',
            'icon' => 'housing-rent.png',
            'active_status' => 'Yes',
            'route' => 'housing/wanted',
            'rate' => 'free',
            'order' => 4
        ]);
        AdSubCategory::create([
            'category_id' => 2,
            'name' =>  'Roommates/Shared',
            'icon' => 'roommate-rent.png',
            'active_status' => 'Yes',
            'route' => 'housing/roommates-shared',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 5
        ]);
        AdSubCategory::create([
            'category_id' => 2,
            'name' =>  'Office/Commercial For Rent',
            'icon' => 'commercial-rent.png',
            'active_status' => 'Yes',
            'route' => 'housing/office-commercial-rent',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 6
        ]);
        AdSubCategory::create([
            'category_id' => 2,
            'name' =>  'Vacation Rentals',
            'icon' => 'vacation-rent.png',
            'active_status' => 'Yes',
            'route' => 'housing/vacation-rentals',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 7
        ]);
        AdSubCategory::create([
            'category_id' => 2,
            'name' =>  'Armenia Rentals',
            'icon' => 'armenian-rent.png',
            'active_status' => 'Yes',
            'route' => 'housing/armenia-rentals',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 8
        ]);
        AdSubCategory::create([
            'category_id' => 2,
            'name' =>  'International Rentals',
            'icon' => 'global-rent.png',
            'active_status' => 'Yes',
            'route' => 'housing/international-rentals',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 9
        ]);
        AdSubCategory::create([
            'category_id' => 2,
            'name' =>  'Other Rentals',
            'icon' => 'other-rent.png',
            'active_status' => 'Yes',
            'route' => 'housing/other-rentals',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 10
        ]);

        // Category 4: Cars
        AdSubCategory::create([
            'category_id' => 4,
            'name' =>  'Cars For Sale',
            'icon' => 'buy.png',
            'active_status' => 'Yes',
            'route' => 'cars/sale',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 11
        ]);
        AdSubCategory::create([
            'category_id' => 4,
            'name' =>  'Cars For Lease/Rent',
            'icon' => 'global-rent.png',
            'active_status' => 'Yes',
            'route' => 'cars/lease-rent',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 12
        ]);

        // Category 5: Real Estate
        AdSubCategory::create([
            'category_id' => 5,
            'name' =>  'Homes For Sale',
            'icon' => 'home-for-sell.png',
            'active_status' => 'Yes',
            'route' => 'real-estate/homes-sale',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 13
        ]);
        AdSubCategory::create([
            'category_id' => 5,
            'name' =>  'Investment Properties',
            'icon' => 'town-home.png',
            'active_status' => 'Yes',
            'route' => 'real-estate/investment-properties',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 14
        ]);
        AdSubCategory::create([
            'category_id' => 5,
            'name' =>  'Land For Sale',
            'icon' => 'land.png',
            'active_status' => 'Yes',
            'route' => 'real-estate/land-sale',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 15
        ]);
        AdSubCategory::create([
            'category_id' => 5,
            'name' =>  'Commercial Real Estate',
            'icon' => 'market.png',
            'active_status' => 'Yes',
            'route' => 'real-estate/commercial',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 16
        ]);
        AdSubCategory::create([
            'category_id' => 5,
            'name' =>  'Vacation Homes',
            'icon' => 'vacation-home.png',
            'active_status' => 'Yes',
            'route' => 'real-estate/vacation-homes',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 17
        ]);
        AdSubCategory::create([
            'category_id' => 5,
            'name' =>  'Time Share',
            'icon' => 'time-shares.png',
            'active_status' => 'Yes',
            'route' => 'real-estate/time-share',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 18
        ]);
        AdSubCategory::create([
            'category_id' => 5,
            'name' =>  'Real Estate in Armenia',
            'icon' => 'hook.png',
            'active_status' => 'Yes',
            'route' => 'real-estate/armenia',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 19
        ]);
        AdSubCategory::create([
            'category_id' => 5,
            'name' =>  'International Real Estate',
            'icon' => 'international-real-estate.png',
            'active_status' => 'Yes',
            'route' => 'real-estate/international',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 20
        ]);

        // Category 7: Events
        AdSubCategory::create([
            'category_id' => 7,
            'name' =>  'Events/Entertainment',
            'icon' => 'event.png',
            'active_status' => 'Yes',
            'route' => 'events/entertainment',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 22
        ]);
        AdSubCategory::create([
            'category_id' => 7,
            'name' =>  'Travel',
            'icon' => 'travel.png',
            'active_status' => 'Yes',
            'route' => 'events/travel',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 21
        ]);

        // Category 9: Pets
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Birds',
            'icon' => 'birds.png',
            'active_status' => 'Yes',
            'route' => 'pets/birds',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
        ]);
        
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Cats',
            'icon' => 'cat.png',
            'active_status' => 'Yes',
            'route' => 'pets/cats',
            'order' => 23
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Dogs',
            'icon' => 'dog.png',
            'active_status' => 'Yes',
            'route' => 'pets/dogs',
            'order' => 24
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Fishes',
            'icon' => 'fish.png',
            'active_status' => 'Yes',
            'route' => 'pets/fishes',
            'order' => 25
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Free Pets to Good Home',
            'icon' => 'pet-friendly.png',
            'active_status' => 'Yes',
            'route' => 'pets/free-pets',
            'order' => 26
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Horses',
            'icon' => 'horse.png',
            'active_status' => 'Yes',
            'route' => 'pets/horses',
            'order' => 27
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Livestock',
            'icon' => 'livestock.png',
            'active_status' => 'Yes',
            'route' => 'pets/livestock',
            'order' => 28
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Pets Lost & Found',
            'icon' => 'finding.png',
            'active_status' => 'Yes',
            'route' => 'pets/lost-found',
            'order' => 29
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Pets Wanted',
            'icon' => 'pet-house.png',
            'active_status' => 'Yes',
            'route' => 'pets/wanted',
            'order' => 30
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Reptiles',
            'icon' => 'pet-house.png',
            'active_status' => 'Yes',
            'route' => 'pets/reptiles',
            'order' => 31
        ]);
        AdSubCategory::create([
            'category_id' => 9,
            'name' =>  'Other',
            'icon' => 'other-pets.png',
            'active_status' => 'Yes',
            'route' => 'pets/other',
            'order' => 32
        ]);

        // Category 11: Community
        AdSubCategory::create([
            'category_id' => 11,
            'name' =>  'Professional Connect',
            'icon' => 'professional.png',
            'active_status' => 'Yes',
            'route' => 'community/professional-connect',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 33
        ]);
        AdSubCategory::create([
            'category_id' => 11,
            'name' =>  'Hobbies & Interests Connect',
            'icon' => 'interest.png',
            'active_status' => 'Yes',
            'route' => 'community/hobbies-interests',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 34
        ]);

        // Category 3: Local Services
        AdSubCategory::create([
            'category_id' => 3,
            'name' => 'Local Services Los Angeles',
            'icon' => 'lc_los_angeles.png',
            'active_status' => 'Yes',
            'route' => 'local-services/los-angeles',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 35
        ]);
        AdSubCategory::create([
            'category_id' => 3,
            'name' => 'Local Services Armenia',
            'icon' => 'lc_armenia.png',
            'active_status' => 'Yes',
            'route' => 'local-services/armenia',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 36
        ]);

        // Category 12: Food
        AdSubCategory::create([
            'category_id' => 12,
            'name' => 'Food Delivery & Takeout',
            'icon' => 'food_delevery_takeout.png',
            'active_status' => 'Yes',
            'route' => 'food/delivery-takeout',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 37
        ]);
        AdSubCategory::create([
            'category_id' => 12,
            'name' => 'Pastries, Delicacies, & Catering',
            'icon' => 'pastries.png',
            'active_status' => 'Yes',
            'route' => 'food/pastries-catering',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 38
        ]);
        AdSubCategory::create([
            'category_id' => 12,
            'name' => 'Restaurants & Fine Dining',
            'icon' => 'restaurant_fine.png',
            'active_status' => 'Yes',
            'route' => 'food/restaurants-dining',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 39
        ]);

        // Category 4: Cars (additional entry)
        AdSubCategory::create([
            'category_id' => 4,
            'name' => 'Car Parts & Accessories',
            'icon' => 'car_part_accessories.png',
            'active_status' => 'Yes',
            'route' => 'cars/parts-accessories',
            'rate' => '10',
            'feature_rate' => '10',
            'social_share_rate' => '10',
            'order' => 40
        ]);
    }
}