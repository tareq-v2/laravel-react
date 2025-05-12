<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::truncate();
        User::create([
            'name' => "Admin",
            'email' => "admin@admin.com",
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => "User 1",
            'email' => "user1@gmail.com",
            'password' => bcrypt('password'),
            'role' => 'customer',
        ]);

        User::create([
            'name' => "User 2",
            'email' => "user2@gmail.com",
            'password' => bcrypt('password'),
            'role' => 'customer',
        ]);
    }
}
