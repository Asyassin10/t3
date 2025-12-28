<?php

namespace Database\Factories;

use App\Models\TimeSheet;
use App\Models\App;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TimeSheetLigne>
 */
class TimeSheetLigneFactory extends Factory
{
    public function definition(): array
    {
        $isWeekend = $this->faker->boolean(20); // 20% weekends
        $isDisabled = $this->faker->boolean(10); // 10% disabled
        $isRestAcceptable = $this->faker->boolean(15);

        return [
            // CastOfValue accepts string|null safely
            'value' => $isWeekend || $isDisabled
                ? null
                : (string) $this->faker->randomElement(['0', '4', '8']),

            'is_week_end' => $isWeekend,
            'is_disabled' => $isDisabled,
            'rest_acceptable' => $isRestAcceptable,

            // relations (adjust if needed)
            'time_sheet_id' => TimeSheet::factory(),
            'app_id' => 44,
        ];
    }

    /**
     * State for a weekend line
     */
    public function weekend(): static
    {
        return $this->state(fn() => [
            'is_week_end' => true,
            'value' => null,
        ]);
    }

    /**
     * State for a disabled line
     */
    public function disabled(): static
    {
        return $this->state(fn() => [
            'is_disabled' => true,
            'value' => null,
        ]);
    }

    /**
     * State for a working day (8h)
     */
    public function workingDay(): static
    {
        return $this->state(fn() => [
            'is_week_end' => false,
            'is_disabled' => false,
            'value' => '8',
        ]);
    }
}
