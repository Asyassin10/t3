<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeder.
     *
     * Create an admin user for Filament access
     * Email: admin@t3system.com
     * Password: admin123
     */
    public function run(): void
    {
        // Check if admin user already exists
        $adminEmail = 'admin@t3system.com';

        if (User::where('email', $adminEmail)->exists()) {
            $this->command->info('Admin user already exists.');
            return;
        }

        User::create([
            'name' => 'Admin',
            'email' => $adminEmail,
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
            'role_id' => 1, // Admin role
        ]);

        $this->command->info('Admin user created successfully!');
        $this->command->info('Email: admin@t3system.com');
        $this->command->info('Password: admin123');
        $this->command->warn('Please change the password after first login!');
    }
}
