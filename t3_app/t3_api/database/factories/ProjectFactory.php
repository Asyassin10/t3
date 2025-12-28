<?php

namespace Database\Factories;

use App\Enums\ProjectStatusEnum;
use App\Models\ClientB2B;
use App\Models\ClientEsoft;
use App\Models\Manager;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_b2b_id' => ClientB2B::factory(), // Creates a related ClientB2B instance
            'manager_id' => Manager::factory(), // Creates a related Manager instance
            'project_name' => $this->faker->words(3, true), // Generates a project name
            'codeprojet' => strtoupper($this->faker->bothify('PRJ-####')), // Random project code
            'dure' => $this->faker->numberBetween(1, 24), // Duration in months
            'info' => Str::limit(value: $this->faker->paragraph, limit: 180),
            'status' => $this->faker->randomElement(ProjectStatusEnum::values()), // Random status from the enum
            'client_esoft_id' => ClientEsoft::factory(), // Simulates an ID (replaceable with related model if needed)
        ];
    }
}
