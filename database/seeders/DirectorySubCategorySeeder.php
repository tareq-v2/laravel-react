<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DirectorySubCategory;

class DirectorySubCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DirectorySubCategory::truncate();
        DirectorySubCategory::create([
            'category_id' => 1,
            'name' => 'Appliance Sales'
        ]);
        DirectorySubCategory::create([
            'category_id' => 1,
            'name' => 'Equipment Repair'
        ]);
        DirectorySubCategory::create([
            'category_id' => 1,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 2,
            'name' => 'Auto Body/Collision'
        ]);
        DirectorySubcategory::create([
            'category_id' => 2,
            'name' => 'Auto Customization/Detail'
        ]);
        DirectorySubcategory::create([
            'category_id' => 2,
            'name' => 'Auto Electric'
        ]);
        DirectorySubcategory::create([
            'category_id' => 2,
            'name' => 'Auto Mechanic'
        ]);
        DirectorySubcategory::create([
            'category_id' => 2,
            'name' => 'Auto Parts & Accessories'
        ]);
        DirectorySubcategory::create([
            'category_id' => 2,
            'name' => 'Auto Rental & Leasing'
        ]);
        DirectorySubcategory::create([
            'category_id' => 2,
            'name' => 'Auto Repair'
        ]);
        DirectorySubcategory::create([
            'category_id' => 2,
            'name' => 'Auto Sales Dealer'
        ]);
        DirectorySubcategory::create([
            'category_id' => 2,
            'name' => 'Car Towing Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 2,
            'name' => 'Mobile Car/Truck Wash'
        ]);
        DirectorySubcategory::create([
            'category_id' => 2,
            'name' => 'Motorcycle Sales & Repair'
        ]);
        DirectorySubcategory::create([
            'category_id' => 2,
            'name' => 'Tire Repair & Service'
        ]);
        DirectorySubcategory::create([
            'category_id' => 2,
            'name' => 'Transmission Service'
        ]);
        DirectorySubcategory::create([
            'category_id' => 2,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 3,
            'name' => 'Barber Shop'
        ]);
        DirectorySubcategory::create([
            'category_id' => 3,
            'name' => 'Beauty Salon'
        ]);
        DirectorySubcategory::create([
            'category_id' => 3,
            'name' => 'Hair Care Treatments'
        ]);
        DirectorySubcategory::create([
            'category_id' => 3,
            'name' => 'Hair Removal/Restoration'
        ]);
        DirectorySubcategory::create([
            'category_id' => 3,
            'name' => 'Makeup Artist'
        ]);
        DirectorySubcategory::create([
            'category_id' => 3,
            'name' => 'Nail Salon'
        ]);
        DirectorySubcategory::create([
            'category_id' => 3,
            'name' => 'Skin/Facial Care'
        ]);
        DirectorySubcategory::create([
            'category_id' => 3,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 4,
            'name' => 'Carpet Cleaning Service'
        ]);
        DirectorySubcategory::create([
            'category_id' => 4,
            'name' => 'Construction/Hauling'
        ]);
        DirectorySubcategory::create([
            'category_id' => 4,
            'name' => 'Fireplace Cleaning Service'
        ]);
        DirectorySubcategory::create([
            'category_id' => 4,
            'name' => 'Garden/Landscape Service'
        ]);
        DirectorySubcategory::create([
            'category_id' => 4,
            'name' => 'House Cleaning Service'
        ]);
        DirectorySubcategory::create([
            'category_id' => 4,
            'name' => 'Office/Business Cleaning Service'
        ]);
        DirectorySubcategory::create([
            'category_id' => 4,
            'name' => 'Pest Control Service'
        ]);
        DirectorySubcategory::create([
            'category_id' => 4,
            'name' => 'Pool Cleaning Service'
        ]);
        DirectorySubcategory::create([
            'category_id' => 4,
            'name' => 'Power Washing Service'
        ]);
        DirectorySubcategory::create([
            'category_id' => 4,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 5,
            'name' => 'Scouting'
        ]);
        DirectorySubcategory::create([
            'category_id' => 5,
            'name' => 'Social'
        ]);
        DirectorySubcategory::create([
            'category_id' => 5,
            'name' => 'Sports'
        ]);
        DirectorySubcategory::create([
            'category_id' => 5,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 6,
            'name' => 'Computer/Phone Sales & Service'
        ]);
        DirectorySubcategory::create([
            'category_id' => 6,
            'name' => 'Security/Camera Systems'
        ]);
        DirectorySubcategory::create([
            'category_id' => 6,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 7,
            'name' => 'Announcements'
        ]);
        DirectorySubcategory::create([
            'category_id' => 7,
            'name' => 'Community Center'
        ]);
        DirectorySubcategory::create([
            'category_id' => 7,
            'name' => 'Social Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 7,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'A/C & Heating Contractor'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Architectural Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Cabinet & Woodworking'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Carpet Installation'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Carpentry Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Concrete Contractor'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Construction Company'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Electrical Contractor'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Engineering Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Fire Protection Systems'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Fireplace Contractor'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Garage Door Installation'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Gate/Ironwork Contractor'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Kitchen & Bath Remodeling'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Landscape Design Contractor'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Painting Contractor'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Plumbing Contractor'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Roofing Contractor'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Solar Power Systems'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Structural Engineering'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Tile & Flooring Contractor'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Windows & Door Contractor'
        ]);
        DirectorySubcategory::create([
            'category_id' => 8,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 9,
            'name' => 'Bookkeeping Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 9,
            'name' => 'Certified Public Accountant'
        ]);
        DirectorySubcategory::create([
            'category_id' => 9,
            'name' => 'Credit Repair & Counselling'
        ]);
        DirectorySubcategory::create([
            'category_id' => 9,
            'name' => 'Financial Consulting'
        ]);
        DirectorySubcategory::create([
            'category_id' => 9,
            'name' => 'Merchant Payment Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 9,
            'name' => 'Mortgage & Loans'
        ]);
        DirectorySubcategory::create([
            'category_id' => 9,
            'name' => 'Tax Preparing Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 9,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 10,
            'name' => 'Bakery & Pastry Shop'
        ]);
        DirectorySubcategory::create([
            'category_id' => 10,
            'name' => 'Banquet Hall'
        ]);
        DirectorySubcategory::create([
            'category_id' => 10,
            'name' => 'Cafe/Coffee Shop'
        ]);
        DirectorySubcategory::create([
            'category_id' => 10,
            'name' => 'Catering Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 10,
            'name' => 'Fast Food'
        ]);
        DirectorySubcategory::create([
            'category_id' => 10,
            'name' => 'Grocery Store'
        ]);
        DirectorySubcategory::create([
            'category_id' => 10,
            'name' => 'Hookah Lounge'
        ]);
        DirectorySubcategory::create([
            'category_id' => 10,
            'name' => 'Liquor & Tobacco Store'
        ]);
        DirectorySubcategory::create([
            'category_id' => 10,
            'name' => 'Meat & Fish Market'
        ]);
        DirectorySubcategory::create([
            'category_id' => 10,
            'name' => 'Restaurants/Dining'
        ]);
        DirectorySubcategory::create([
            'category_id' => 10,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 11,
            'name' => 'Government Office'
        ]);
        DirectorySubcategory::create([
            'category_id' => 11,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Chiropractor'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Dentistry'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Dermatology'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Hearing Aid Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Home Health Care'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Hospice Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Hospital & Clinics'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Live-in/Assisted Living Facility'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Medical Supplies & Products'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Mental Health Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Message Therapy'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Ophthalmology'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Optometry'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Pharmacy'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Physical Therapy'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Physician & Doctor'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Plastic Surgery'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Psychology'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Radiology & Ultrasound'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Rehab Facility'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Urgent Care Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 12,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 13,
            'name' => 'A/C & Heating Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 13,
            'name' => 'Electrical Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 13,
            'name' => 'Fence/Gate Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 13,
            'name' => 'Garage Door Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 13,
            'name' => 'Gardening & Landscape Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 13,
            'name' => 'Handyman Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 13,
            'name' => 'Painting Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 13,
            'name' => 'Plumbing Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 13,
            'name' => 'Pest Control Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 13,
            'name' => 'Pool Cleaning Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 13,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 14,
            'name' => 'Auto Insurance'
        ]);
        DirectorySubcategory::create([
            'category_id' => 14,
            'name' => 'Business Insurance'
        ]);
        DirectorySubcategory::create([
            'category_id' => 14,
            'name' => 'Dental Insurance'
        ]);
        DirectorySubcategory::create([
            'category_id' => 14,
            'name' => 'Health Insurance'
        ]);
        DirectorySubcategory::create([
            'category_id' => 14,
            'name' => 'Home Insurance'
        ]);
        DirectorySubcategory::create([
            'category_id' => 14,
            'name' => 'Insurance Agents'
        ]);
        DirectorySubcategory::create([
            'category_id' => 14,
            'name' => 'Life Insurance'
        ]);
        DirectorySubcategory::create([
            'category_id' => 14,
            'name' => 'Public Insurance Adjuster'
        ]);
        DirectorySubcategory::create([
            'category_id' => 14,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 15,
            'name' => 'Apostille Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 15,
            'name' => 'Attorney'
        ]);
        DirectorySubcategory::create([
            'category_id' => 15,
            'name' => 'Bankruptcy Law'
        ]);
        DirectorySubcategory::create([
            'category_id' => 15,
            'name' => 'Business Law'
        ]);
        DirectorySubcategory::create([
            'category_id' => 15,
            'name' => 'Civil Rights Law'
        ]);
        DirectorySubcategory::create([
            'category_id' => 15,
            'name' => 'Criminal Law'
        ]);
        DirectorySubcategory::create([
            'category_id' => 15,
            'name' => 'Family Law'
        ]);
        DirectorySubcategory::create([
            'category_id' => 15,
            'name' => 'Immigration Law'
        ]);
        DirectorySubcategory::create([
            'category_id' => 15,
            'name' => 'Labor/Employment Law'
        ]);
        DirectorySubcategory::create([
            'category_id' => 15,
            'name' => 'Law Firm'
        ]);
        DirectorySubcategory::create([
            'category_id' => 15,
            'name' => 'Notary Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 15,
            'name' => 'Personal Injury Law'
        ]);
        DirectorySubcategory::create([
            'category_id' => 15,
            'name' => 'Property Damage Law'
        ]);
        DirectorySubcategory::create([
            'category_id' => 15,
            'name' => 'Translation Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 15,
            'name' => 'Wills & Trusts'
        ]);
        DirectorySubcategory::create([
            'category_id' => 15,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 16,
            'name' => 'Broker/Document Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 16,
            'name' => 'Cargo Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 16,
            'name' => 'Moving Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 16,
            'name' => 'Shuttle Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 16,
            'name' => 'Trucking Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 16,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 17,
            'name' => 'Boarding'
        ]);
        DirectorySubcategory::create([
            'category_id' => 17,
            'name' => 'Grooming'
        ]);
        DirectorySubcategory::create([
            'category_id' => 17,
            'name' => 'Supplies'
        ]);
        DirectorySubcategory::create([
            'category_id' => 17,
            'name' => 'Training'
        ]);
        DirectorySubcategory::create([
            'category_id' => 17,
            'name' => 'Veterinary Care'
        ]);
        DirectorySubcategory::create([
            'category_id' => 17,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 18,
            'name' => 'Design/Logo Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 18,
            'name' => 'Printing/Publishing Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 18,
            'name' => 'Video Production/Editing Services'
        ]);

        DirectorySubcategory::create([
            'category_id' => 18,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 19,
            'name' => 'Business Opportunities'
        ]);
        DirectorySubcategory::create([
            'category_id' => 19,
            'name' => 'Commercial Real Estate'
        ]);
        DirectorySubcategory::create([
            'category_id' => 19,
            'name' => 'Home & Mortgage Loans'
        ]);
        DirectorySubcategory::create([
            'category_id' => 19,
            'name' => 'Home Inspection Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 19,
            'name' => 'Property Management Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 19,
            'name' => 'Real Estate Agent/Broker'
        ]);
        DirectorySubcategory::create([
            'category_id' => 19,
            'name' => 'Real Estate Appraisal Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 19,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 20,
            'name' => 'Religious Bookstore'
        ]);
        DirectorySubcategory::create([
            'category_id' => 20,
            'name' => 'Religious Institution'
        ]);
        DirectorySubcategory::create([
            'category_id' => 20,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 21,
            'name' => 'Bookstore'
        ]);
        DirectorySubcategory::create([
            'category_id' => 21,
            'name' => 'Clothing Store'
        ]);
        DirectorySubcategory::create([
            'category_id' => 21,
            'name' => 'Furniture Store'
        ]);
        DirectorySubcategory::create([
            'category_id' => 21,
            'name' => 'Gift Shop'
        ]);
        DirectorySubcategory::create([
            'category_id' => 21,
            'name' => 'Jewelry Sales & Repair'
        ]);
        DirectorySubcategory::create([
            'category_id' => 21,
            'name' => "Men's Wear Store"
        ]);
        DirectorySubcategory::create([
            'category_id' => 21,
            'name' => "Women's Wear Store"
        ]);
        DirectorySubcategory::create([
            'category_id' => 21,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 22,
            'name' => 'Art School'
        ]);
        DirectorySubcategory::create([
            'category_id' => 22,
            'name' => 'Computer Learning School'
        ]);
        DirectorySubcategory::create([
            'category_id' => 22,
            'name' => 'Construction/Trade School'
        ]);
        DirectorySubcategory::create([
            'category_id' => 22,
            'name' => 'Driving School'
        ]);
        DirectorySubcategory::create([
            'category_id' => 22,
            'name' => 'Language Learning School'
        ]);
        DirectorySubcategory::create([
            'category_id' => 22,
            'name' => 'Music School'
        ]);
        DirectorySubcategory::create([
            'category_id' => 22,
            'name' => 'Performing Art School'
        ]);
        DirectorySubcategory::create([
            'category_id' => 22,
            'name' => 'Preschool/Kindergarten'
        ]);
        DirectorySubcategory::create([
            'category_id' => 22,
            'name' => 'Private School'
        ]);
        DirectorySubcategory::create([
            'category_id' => 22,
            'name' => 'Special Education School'
        ]);
        DirectorySubcategory::create([
            'category_id' => 22,
            'name' => 'Tutoring Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 22,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 23,
            'name' => 'Adult Day Care Center'
        ]);
        DirectorySubcategory::create([
            'category_id' => 23,
            'name' => 'Bail Bond & Surety Agency'
        ]);
        DirectorySubcategory::create([
            'category_id' => 23,
            'name' => 'Section 8 Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 23,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'Band, Musician & Singer'
        ]);
        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'Banquet Hall & Reception Rental'
        ]);
        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'Bridal Dress Shop & Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'Catering Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'Costume Character Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'Custom Cakes & Desserts'
        ]);
        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'DJ Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'Event Decor & Rentals'
        ]);
        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'Event Planner & Coordinator'
        ]);
        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'Flower & Florist Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'Hookah Catering Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'Limo/Transportation Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'Photography & Video Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'Security Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'Show Performers'
        ]);
        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'Valet Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 24,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 25,
            'name' => 'Basketball Club'
        ]);
        DirectorySubcategory::create([
            'category_id' => 25,
            'name' => 'Boxing Club'
        ]);
        DirectorySubcategory::create([
            'category_id' => 25,
            'name' => 'Dance & Fitness School'
        ]);
        DirectorySubcategory::create([
            'category_id' => 25,
            'name' => 'Martial Arts'
        ]);
        DirectorySubcategory::create([
            'category_id' => 25,
            'name' => 'Soccer Club'
        ]);
        DirectorySubcategory::create([
            'category_id' => 25,
            'name' => 'Tennis Club'
        ]);
        DirectorySubcategory::create([
            'category_id' => 25,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 26,
            'name' => 'Hotel Accommodations'
        ]);
        DirectorySubcategory::create([
            'category_id' => 26,
            'name' => 'Shuttle Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 26,
            'name' => 'Tours/Vacations'
        ]);
        DirectorySubcategory::create([
            'category_id' => 26,
            'name' => 'Travel Agent'
        ]);
        DirectorySubcategory::create([
            'category_id' => 26,
            'name' => 'Other'
        ]);

        DirectorySubcategory::create([
            'category_id' => 27,
            'name' => 'SEO/SEM Services'
        ]);
        DirectorySubcategory::create([
            'category_id' => 27,
            'name' => 'Social Media Marketing'
        ]);
        DirectorySubcategory::create([
            'category_id' => 27,
            'name' => 'Website Developer'
        ]);
        DirectorySubcategory::create([
            'category_id' => 27,
            'name' => 'Other'
        ]);
    }
}
