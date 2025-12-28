<?php

namespace Database\Factories;

use App\Models\Consultant;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ConsultantProject>
 */
class ConsultantProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'consultant_id' => Consultant::factory(),
            'project_id' => Project::factory(),
            'price_per_day' => $this->faker->numberBetween(100, 800),
        ];
    }
}
