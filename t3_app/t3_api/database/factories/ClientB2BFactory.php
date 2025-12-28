<?php

namespace Database\Factories;

use App\Models\ClientEsoft;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClientB2B>
 */
class ClientB2BFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_esoft_id' => ClientEsoft::factory(), // Creates a related ClientEsoft instance
            'client_b2b_name' => $this->faker->company, // Generates a random company name
        ];
    }
}
