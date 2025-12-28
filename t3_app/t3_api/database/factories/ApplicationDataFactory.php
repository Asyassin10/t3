<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ApplicationData>
 */
class ApplicationDataFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date_of_start_sending_notifications' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'logo' => $this->faker->imageUrl(200, 200, 'business', true, 'logo'),
        ];
    }
}
