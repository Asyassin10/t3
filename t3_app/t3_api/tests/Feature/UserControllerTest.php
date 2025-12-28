<?php

namespace Tests\Feature;

use App\Enums\RoleEnumString;
use App\Models\ClientB2B;
use App\Models\ClientEsoft;
use App\Models\Consultant;
use App\Models\ConsultantProject;
use App\Models\Manager;
use App\Models\Project;
use App\Models\User;
use App\Services\ExceptionMessagesService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Run the artisan command before each test
        $this->artisan(command: 'init-database')->run();
    }
    /**
     * A basic feature test example.
     */
    public function test_invalid_role_as_admin(): void
    {
        // Create a user
        $user = User::factory()->withRole(RoleEnumString::Admin->value)->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Simulate authentication
        $this->actingAs($user);

        $response = $this->getJson('/api/users/get_assigned_users');

        $response->assertStatus(200)->assertJson(value: ExceptionMessagesService::errorInvalidRole());
    }
    public function test_invalid_role_as_concultant(): void
    {
        // Create a user
        $user = User::factory()->withRole(role_name: RoleEnumString::Consultant->value)->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Simulate authentication
        $this->actingAs($user);

        $response = $this->getJson('/api/users/get_assigned_users');

        $response->assertStatus(200)->assertJson(value: ExceptionMessagesService::errorInvalidRole());
    }
    public function test_invalid_user_as_clientesoft(): void
    {
        // Create a user
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate authentication
        $this->actingAs($user);

        $response = $this->getJson('/api/users/get_assigned_users');

        $response->assertStatus(200)->assertJson(value: ExceptionMessagesService::errorUserNotFound());
    }
    public function test_invalid_user_as_manager(): void
    {
        // Create a user
        $user = User::factory()->withRole(role_name: RoleEnumString::Manager->value)->create();

        // Simulate authentication
        $this->actingAs($user);

        $response = $this->getJson('/api/users/get_assigned_users');

        $response->assertStatus(200)->assertJson(value: ExceptionMessagesService::errorUserNotFound());
    }

    public function test_client_esoft_with_assigned_users()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Simulate authentication
        $this->actingAs($user);

        Manager::factory(2)->create();
        Consultant::factory(3)->create();

        $response = $this->getJson('/api/users/get_assigned_users');

        $response->assertStatus(200);
        $response->assertJsonCount(5); // 2 managers + 3 consultants
    }
    public function test_manager_with_assigned_users()
    {
        $user_manager = User::factory()->withRole(role_name: RoleEnumString::Manager->value)->create();
        $user_clientesoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user_clientesoft->id,
        ]);
        $manager = Manager::factory()->create([
            'user_id' => $user_manager->id,
        ]);

        // Simulate authentication
        $this->actingAs($user_manager);
        $client_b2b_factory = ClientB2B::factory()->create([
            "client_esoft_id" => $clientEsoft->id,
        ]);
        $project = Project::factory()->create(attributes: ['manager_id' => $manager->id, "client_b2b_id" => $client_b2b_factory->id, 'client_esoft_id' => $clientEsoft->id]);

        $consultants = Consultant::factory(3)->create();
        foreach ($consultants as $consultant) {

            $project->consultants()->attach($consultant->id, ['price_per_day' => 0]);
        }

        $response = $this->getJson('/api/users/get_assigned_users');

        $response->assertStatus(200);
        $response->assertJsonCount(3); // 3 consultants
    }

    public function test_activate_account_with_missing_token()
    {
        $response = $this->postJson('/api/active_account', data: []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['token']);
    }

    public function test_activate_account_with_invalid_token()
    {
        $response = $this->postJson('/api/active_account', ['token' => 'invalid-token']);

        $response->assertStatus(404);
        $response->assertJson(['message' => 'resource est invalide.']);
    }
    public function test_activate_account_success()
    {
        $user = User::factory()->create([
            'account_token' => 'valid-token',
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/active_account', ['token' => 'valid-token']);

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Le compte a été activé avec succès.']);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'is_active' => true,
        ]);
    }
}
