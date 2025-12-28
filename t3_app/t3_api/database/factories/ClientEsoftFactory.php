<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClientEsoft>
 */
class ClientEsoftFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(), // Creates a new user and associates it
            'kbis_file' => $this->faker->word . '.pdf', // Simulated file name
            'app_api_key' => $this->faker->uuid, // Random UUID
            'user_subscriptionplan_date_start' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'user_subscriptionplan_date_end' => $this->faker->dateTimeBetween('now', '+1 year'),
        ];
    }
}
