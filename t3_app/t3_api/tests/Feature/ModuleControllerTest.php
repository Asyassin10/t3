<?php

namespace Tests\Feature;

use App\Enums\RoleEnumString;
use App\Models\AssignedModules;
use App\Models\ClientEsoft;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ModuleControllerTest extends TestCase
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

    public function test_it_lists_all_accessible_modules()
    {
        // Create a user with ClientEsoft role
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        ClientEsoft::factory()->create(['user_id' => $user_client_esoft->id]);

        $this->actingAs($user_client_esoft);

        // Create some assigned modules
        $assignedModules = AssignedModules::factory()->count(3)->create([
            'assigned_module_name' => 'Module ' . random_int(1, 100),
        ]);

        $response = $this->getJson(route('ListAccessibleModules'));

        $response->assertStatus(200)
            ->assertJsonCount(3) // ensure all assigned modules are returned
            ->assertJsonFragment([
                'assigned_module_name' => $assignedModules[0]->assigned_module_name,
            ])
            ->assertJsonFragment([
                'assigned_module_name' => $assignedModules[1]->assigned_module_name,
            ]);
    }


    public function test_it_returns_empty_array_if_no_modules_assigned()
    {
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        ClientEsoft::factory()->create(['user_id' => $user_client_esoft->id]);

        $this->actingAs($user_client_esoft);

        // No assigned modules created

        $response = $this->getJson(route('ListAccessibleModules'));

        $response->assertStatus(200)
            ->assertExactJson([]); // returns empty array
    }
}
