<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DirectoryRate;

class DirectoryRatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DirectoryRate::truncate();
        DirectoryRate::create([
            'category' => 'Normal Fee',
            'amount' => 10,
            'order' => 1,
        ]);
        DirectoryRate::create([
            'category' => 'Premium Fee',
            'amount' => 75,
            'order' => 3,
        ]);
        DirectoryRate::create([
            'category' => 'Extend Sub Category Fee',
            'amount' => 10,
            'order' => 2,
        ]);
        DirectoryRate::create([
            'category' => 'Sub Cateogry Feature Fee',
            'amount' => 125,
            'order' => 4,
        ]);
    }
}
