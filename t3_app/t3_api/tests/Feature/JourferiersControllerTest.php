<?php

namespace Tests\Feature;

use App\Enums\RoleEnumString;
use App\Models\ClientEsoft;
use App\Models\Jourferier;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class JourferiersControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;
    /**
     * A basic feature test example.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Run the artisan command before each test
        $this->artisan(command: 'init-database')->run();
    }
    public function test_it_returns_empty_array_if_no_holidays_in_current_month()
    {
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user_client_esoft->id,
        ]);

        // Create B2B client

        $this->actingAs($user_client_esoft);
        // Freeze time
        Carbon::setTestNow(Carbon::create(2025, 12, 23));

        // No holidays created for December
        Jourferier::factory()->create([
            'jourferiers_date' => '2025-11-05',
        ]);

        $response = $this->getJson('/api/holidays/current-month');

        $response->assertStatus(200);
        $response->assertExactJson([]); // returns empty array
    }
    public function test_it_returns_holidays_for_the_current_month()
    {
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user_client_esoft->id,
        ]);

        // Create B2B client

        $this->actingAs($user_client_esoft);
        // Freeze time for consistency
        Carbon::setTestNow(Carbon::create(2025, 12, 23));

        // Create holidays: some in current month, some not
        $currentMonthHoliday = Jourferier::factory()->create([
            'jourferiers_date' => '2025-12-10',
        ]);

        $otherMonthHoliday = Jourferier::factory()->create([
            'jourferiers_date' => '2025-11-15',
        ]);

        // Call the API
        $response = $this->getJson('/api/holidays/current-month');

        // Assert response
        $response->assertStatus(200);

        $response->assertJsonCount(1); // only one holiday in current month

        $response->assertJsonFragment([
            'id' => $currentMonthHoliday->id,
            'jourferiers_date' => 10, // day only
        ]);

        // Ensure the holiday from other month is not included
        $response->assertJsonMissing([
            'id' => $otherMonthHoliday->id,
        ]);
    }
    public function test_it_can_store_a_new_holiday()
    {
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        ClientEsoft::factory()->create(['user_id' => $user_client_esoft->id]);

        $this->actingAs($user_client_esoft);

        $payload = [
            'jourferiers_date' => '2025-12-25',
            'description' => 'Christmas Day',
            'number_days' => 1,
        ];

        $response = $this->postJson('/api/holidays/store', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'description' => 'Christmas Day',
                'number_days' => 1,
            ]);

        $this->assertDatabaseHas('jourferiers', [
            'description' => 'Christmas Day',
            'number_days' => 1,
        ]);
    }

    public function test_it_can_show_a_holiday()
    {
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        ClientEsoft::factory()->create(['user_id' => $user_client_esoft->id]);

        $this->actingAs($user_client_esoft);

        $holiday = Jourferier::factory()->create();

        $response = $this->getJson("/api/holidays/show/{$holiday->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $holiday->id,
                'description' => $holiday->description,
            ]);
    }

    public function test_it_can_update_a_holiday()
    {
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        ClientEsoft::factory()->create(['user_id' => $user_client_esoft->id]);

        $this->actingAs($user_client_esoft);

        $holiday = Jourferier::factory()->create();

        $payload = [
            'jourferiers_date' => '2025-12-31',
            'description' => 'New Year Eve',
            'number_days' => 1,
        ];

        $response = $this->postJson("/api/holidays/update/{$holiday->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'description' => 'New Year Eve',
            ]);

        $this->assertDatabaseHas('jourferiers', [
            'id' => $holiday->id,
            'description' => 'New Year Eve',
        ]);
    }

    public function test_it_can_delete_a_holiday()
    {
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        ClientEsoft::factory()->create(['user_id' => $user_client_esoft->id]);

        $this->actingAs($user_client_esoft);

        $holiday = Jourferier::factory()->create();

        $response = $this->deleteJson("/api/holidays/destroy/{$holiday->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['message' => 'Jourferier deleted successfully.']);

        $this->assertDatabaseMissing('jourferiers', [
            'id' => $holiday->id,
        ]);
    }
    public function test_it_returns_all_holidays_index()
    {
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        ClientEsoft::factory()->create(['user_id' => $user_client_esoft->id]);

        $this->actingAs($user_client_esoft);

        // Create multiple holidays
        $holidays = Jourferier::factory()->count(3)->create();

        $response = $this->getJson('/api/holidays/index');

        $response->assertStatus(200)
            ->assertJsonCount(14) // ensure all created holidays are returned
            ->assertJsonFragment([
                'id' => $holidays[0]->id,
                'description' => $holidays[0]->description,
            ])
            ->assertJsonFragment([
                'id' => $holidays[1]->id,
                'description' => $holidays[1]->description,
            ]);
    }

    public function test_it_can_show_a_specific_holiday()
    {
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        ClientEsoft::factory()->create(['user_id' => $user_client_esoft->id]);

        $this->actingAs($user_client_esoft);

        $holiday = Jourferier::factory()->create([
            'jourferiers_date' => '2025-12-25',
            'description' => 'Christmas Day',
            'number_days' => 1,
        ]);

        $response = $this->getJson("/api/holidays/show/{$holiday->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $holiday->id,
                'description' => 'Christmas Day',
                'number_days' => 1,
            ]);
    }
}
