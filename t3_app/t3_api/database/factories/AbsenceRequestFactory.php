<?php

namespace Database\Factories;

use App\Enums\AbsenceRequestStatusEnum;
use App\Models\AbsenceRequestType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AbsenceRequest>
 */
class AbsenceRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type_absence_id' => AbsenceRequestType::factory(), // Assumes AbsenceRequestTypeFactory exists
            'status' => $this->faker->randomElement(AbsenceRequestStatusEnum::values()),
            'reason' => $this->faker->sentence(),
            'nombre_des_jours' => $this->faker->numberBetween(1, 10),
            'date_debut' => $this->faker->date(),
            'date_fin' => $this->faker->date(),
            'date_exacte' => $this->faker->date(),
            'date_validation' => $this->faker->optional()->date(),
            'is_valid' => $this->faker->boolean(),
            'user_id' => User::factory(), // Assumes UserFactory exists
        ];
    }
}
