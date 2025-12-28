<?php

namespace Database\Factories;

use App\Enums\FactureStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Facture>
 */
class FactureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'year' => $this->faker->year(),
            'month' => $this->faker->numberBetween(1, 12),
            'date_facture' => $this->faker->date(),
            'nombre_consultant' => $this->faker->numberBetween(1, 10),
            'numero_facture' => $this->faker->unique()->numerify('FAC-#####'),
            'client_b2b_id' => \App\Models\ClientB2B::factory(),
            'facture_path' => $this->faker->filePath(),
            'note' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(FactureStatus::cases()),
            'paid_at' => $this->faker->optional()->dateTime(),
        ];
    }
}
