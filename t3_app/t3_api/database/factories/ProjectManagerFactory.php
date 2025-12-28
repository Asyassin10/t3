<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProjectManager>
 */
class ProjectManagerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'project_id' => $this->faker->numberBetween(1, 100),
            'manager_id' => $this->faker->numberBetween(1, 100),
            'project_manager_price_per_day' => $this->faker->randomFloat(2, 100, 1000),
            'date_of_start' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'date_of_end' => $this->faker->dateTimeBetween('now', '+3 months'),
        ];
    }
}
