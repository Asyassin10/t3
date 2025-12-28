<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Jourferier>
 */
class JourferierFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'jourferiers_date' => $this->faker->date(), // random date
            'description' => $this->faker->sentence(),  // random description
            'number_days' => $this->faker->numberBetween(1, 10), // random number of days

        ];
    }
}
