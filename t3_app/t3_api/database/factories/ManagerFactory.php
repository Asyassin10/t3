<?php

namespace Database\Factories;

use App\Models\ClientEsoft;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Manager>
 */
class ManagerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_esoft_id' => ClientEsoft::factory(), // Assumes ClientEsoftFactory exists
            'user_id' => User::factory(),
        ];
    }
}
