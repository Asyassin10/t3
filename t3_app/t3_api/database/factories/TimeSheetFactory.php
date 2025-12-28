<?php

namespace Database\Factories;

use App\Models\Activite;
use App\Models\CRA;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TimeSheet>
 */
class TimeSheetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'activite_id' => Activite::factory(),
            'ids_of_days' => json_encode($this->faker->randomElements([1, 2, 3, 4, 5, 6, 7], $this->faker->numberBetween(1, 7))),
            'count_of_days' => $this->faker->numberBetween(1, 7),
            'date' => $this->faker->date(),
            'user_id' => User::factory(),
            'cra_id' => CRA::factory(),
        ];
    }
}
