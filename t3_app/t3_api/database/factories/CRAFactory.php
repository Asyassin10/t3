<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CRA>
 */
class CRAFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'status' => $this->faker->randomElement(['draft', 'submitted', 'approved', 'rejected']),
            'number_of_days_available' => $this->faker->numberBetween(0, 30),
            'number_of_days_filled' => $this->faker->numberBetween(0, 30),
            'progress' => $this->faker->numberBetween(0, 100),
        ];
    }
}
