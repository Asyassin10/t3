<?php

namespace Tests\Feature;

use App\Enums\RoleEnumString;
use App\Models\AppCommercialData;
use App\Models\ClientB2B;
use App\Models\ClientEsoft;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ClientCommercialDataControllerTest extends TestCase
{
    use RefreshDatabase;
    protected User $user;
    protected ClientEsoft $clientEsoft;
    protected function setUp(): void
    {
        parent::setUp();

        // Run the artisan command before each test
        $this->artisan(command: 'init-database')->run();
        // Create a user with ClientEsoft role
        $this->user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        $this->clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $this->user->id,
        ]);

        // Authenticate
        $this->actingAs($this->user);
    }
    public function test_it_can_sync_client_commercial_data_with_client()
    {
        $client = ClientB2B::factory()->create();

        $payload = [
            'client_b2b_id' => $client->id,
            'data' => [
                ['key' => 'Revenue', 'value' => '1000'],
                ['key' => 'Employees', 'value' => '50'],
            ],
        ];

        $response = $this->postJson(route('syncClientCommercialDataWithClient'), $payload);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Client commercial data synchronized successfully']);


        $this->assertDatabaseHas('client_commercial_data', ['key' => 'Revenue', 'value' => '1000']); // Assuming table exists
    }
    public function test_it_returns_app_commercial_data_for_client_esoft_user()
    {
        // Seed some AppCommercialData
        AppCommercialData::factory()->create(['key' => 'Revenue', 'value' => '1000']);

        $response = $this->getJson(route('getAppCommercialData'));

        $response->assertStatus(200)
            ->assertJsonFragment(['key' => 'Revenue', 'value' => '1000']);
    }
    public function test_it_denies_app_commercial_data_for_non_client_esoft_user()
    {
        $otherUser = User::factory()->withRole(role_name: 'Manager')->create();
        $this->actingAs($otherUser);

        $response = $this->getJson(route('getAppCommercialData'));

        $response->assertStatus(403)
            ->assertJson(['error' => 'Unauthorized']); // Assuming ExceptionMessagesService::errorInvalidRole() returns this
    }
    public function test_it_can_sync_app_commercial_data_for_client_esoft_user()
    {
        $payload = [
            'data' => [
                ['key' => 'Revenue', 'value' => '2000'],
                ['key' => 'Employees', 'value' => '100'],
            ],
        ];

        $response = $this->postJson(route('syncClientCommercialDataForApp'), $payload);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Client commercial data synchronized successfully']);

        $this->assertDatabaseHas('app_commercial_data', ['key' => 'Revenue', 'value' => '2000']);
    }
    public function test_it_can_clear_app_commercial_data_if_no_data_provided()
    {
        // Seed some data first
        AppCommercialData::factory()->count(3)->create();

        $response = $this->postJson(route('syncClientCommercialDataForApp'), []);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Client commercial data cleared successfully']);

        $this->assertDatabaseCount('app_commercial_data', 0);
    }
    public function test_it_denies_sync_for_non_client_esoft_user()
    {
        $otherUser = User::factory()->withRole(role_name: 'Manager')->create();
        $this->actingAs($otherUser);

        $payload = [
            'data' => [
                ['key' => 'Revenue', 'value' => '2000']
            ],
        ];

        $response = $this->postJson(route('syncClientCommercialDataForApp'), $payload);

        $response->assertStatus(status: 403)
            ->assertJson(['error' => 'Unauthorized']);
    }
}
