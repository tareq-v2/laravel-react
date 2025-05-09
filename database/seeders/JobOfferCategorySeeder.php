<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JobOfferCategory;

class JobOfferCategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            'Accountant/Bookkeeper',
            'Appliance Technician',
            'Auto Body',
            'Auto Mechanic',
            'Auto Sales',
            'Babysitter/Nanny',
            'Bakery/Pastry',
            'Beauty Salon',
            'Car Wash',
            'Caregiver',
            'Cashier',
            'Child Care',
            'Cleaning Services',
            'Construction',
            'Delivery Jobs',
            'Dental Assistant/Office',
            'Dispatcher',
            'Driver',
            'Dry Cleaning',
            'Electrician',
            'Financial Services',
            'Florist',
            'Government Jobs',
            'Grocery/Market',
            'Housekeeper/Maid',
            'In-Home Care',
            'Jewelry Sales/Repair',
            'Legal/Paralegal',
            'Medical/Healthcare',
            'Medical Office/Billing',
            'Nail Salon',
            'No Experience Required',
            'Office/Admin',
            'Parking Attendant',
            'Pet Grooming',
            'Pharmacy',
            'Pool Cleaning',
            'Receptionist/Front Desk',
            'Restaurant Jobs',
            'Mall Jobs',
            'Sales/Marketing',
            'Security Guard',
            'Smoke Shop',
            'Tailor/Alteration',
            'Teacher/Education',
            'Telemarketing',
            'Truck Driver',
            'UBER Driver',
            'Web/IT Developer',
            'Work From Home',
            'Other Jobs'
        ];

        foreach ($categories as $category) {
            JobOfferCategory::create(['name' => $category]);
        }
    }
}