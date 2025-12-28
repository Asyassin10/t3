<?php

namespace Tests\Feature;

use App\Enums\RoleEnumString;
use App\Models\ClientB2B;
use App\Models\ClientEsoft;
use App\Models\User;
use App\Services\ExceptionMessagesService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class ClientB2BControllerTest extends TestCase
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
    // ------------------      CreateB2BClient            --------------------------------
    public function test_create_b2b_client_validation_error(): void
    {
        // Create a user
        $user = User::factory()->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Simulate authentication
        $this->actingAs($user);

        // Send the POST request without 'name'
        $response = $this->postJson('/api/client_b2b/create_client_b2b', []);

        // Assert the response status
        $response->assertStatus(422);

        // Assert validation error structure
        $response->assertJsonValidationErrors(['name']);
    }
    public function test_create_b2b_client_user_not_found(): void
    {
        // Create a user
        $user = User::factory()->create();

        // Simulate authentication
        $this->actingAs($user);

        // Send the POST request
        $response = $this->postJson('/api/client_b2b/create_client_b2b', [
            'name' => 'Test B2B Client',
        ]);

        // Assert the response status
        $response->assertStatus(404);

        // Assert the response message
        $response->assertJson([
            'msg' => 'user not found',
        ]);
    }
    public function test_create_b2b_client_successful(): void
    {

        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        // Simulate the ClientEsoft model for the user
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Simulate authentication
        $this->actingAs($user);

        // Send the POST request
        $response = $this->postJson('/api/client_b2b/create_client_b2b', [
            'name' => 'Test B2B Client',
        ]);

        // Assert the response status
        $response->assertStatus(200);

        // Assert the structure of the response
        $response->assertJsonStructure([
            'id',
            'client_esoft_id',
            'client_b2b_name',
            'created_at',
            'updated_at',
        ]);

        // Assert the data in the database
        $this->assertDatabaseHas('client_b2b', [
            'client_esoft_id' => $clientEsoft->id,
            'client_b2b_name' => 'Test B2B Client',
        ]);
    }

    // ------------------      GetAllClientB2B            --------------------------------
    public function test_it_returns_paginated_clients_for_valid_user()
    {

        // Create a user
        $user = User::factory()->create();

        // Simulate the ClientEsoft model for the user
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Simulate authentication
        $this->actingAs($user);
        ClientB2B::factory()->count(15)->create(['client_esoft_id' => $clientEsoft->id]);

        $response = $this->getJson('/api/client_b2b/get_all_client_b2b?page=1'); // Adjust the endpoint as needed
        $response->assertStatus(200)
            ->assertJsonStructure([
                'current_page',
                'data',
                'first_page_url',
                'from',
                'last_page',
                'last_page_url',
                'links',
                'next_page_url',
                'path',
                'per_page',
                'prev_page_url',
                'to',
                'total',
            ]);

        $this->assertCount(4, $response->json('data')); // Verify perPage
    }
    public function test_it_returns_422_when_validation_fails()
    {
        // Arrange
        $user = User::factory()->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);
        $this->actingAs($user);

        // Act
        $response = $this->getJson('/api/client_b2b/get_all_client_b2b?page=0');

        // Assert
        $response->assertStatus(422)
            ->assertJsonStructure([
                'errors' => ['page'],
            ]);
    }
    public function test_it_returns_422_when_value_is_too_long()
    {
        $user = User::factory()->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);
        $this->actingAs($user);

        $response = $this->getJson('/api/client_b2b/get_all_client_b2b?value=' . str_repeat('a', 300));

        $response->assertStatus(422)
            ->assertJsonStructure([
                'errors' => ['value'],
            ]);
    }
    public function test_it_returns_404_when_client_b2b_does_not_belong_to_authenticated_user()
    {
        // Arrange
        $user = User::factory()->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);
        $this->actingAs($user);

        // ClientEsoft for authenticated user
        $userClientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Another user + esoft (ownership mismatch)
        $otherUser = User::factory()->create();
        $otherClientEsoft = ClientEsoft::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        // ClientB2B belongs to OTHER ClientEsoft
        $clientB2B = ClientB2B::factory()->create([
            'client_esoft_id' => $otherClientEsoft->id,
            'client_b2b_name' => 'Other Client',
        ]);

        // Act
        $response = $this->postJson(
            route('UpdateB2BClient', ['id' => $clientB2B->id]),
            [
                'name' => 'Updated Name',
            ]
        );

        // Assert
        $response->assertStatus(404)
            ->assertJson(
                ExceptionMessagesService::ResourceNotFound(resource: 'Client B2B')
            );
    }

    public function test_it_filters_clients_by_search_value()
    {
        // Arrange
        $user = User::factory()->create();

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        $this->actingAs($user);

        ClientB2B::factory()->create([
            'client_esoft_id' => $clientEsoft->id,
            'client_b2b_name' => 'Acme Corporation',
        ]);

        ClientB2B::factory()->create([
            'client_esoft_id' => $clientEsoft->id,
            'client_b2b_name' => 'Other Company',
        ]);

        // Act
        $response = $this->getJson('/api/client_b2b/get_all_client_b2b?value=Acme');

        // Assert
        $response->assertStatus(200);

        $this->assertCount(1, $response->json('data'));
        $this->assertEquals(
            'Acme Corporation',
            $response->json('data.0.client_b2b_name')
        );
    }

    public function test_handles_empty_paginated_data_in_GetAllClientB2B()
    {
        // Create a user and associated ClientEsoft
        // Create a user
        $user = User::factory()->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Simulate authentication
        $this->actingAs($user);
        // No ClientB2B records for the given ClientEsoft
        $response = $this->getJson('/api/client_b2b/get_all_client_b2b?page=55'); // Adjust the endpoint as needed

        $response->assertStatus(200)
            ->assertJson([
                'data' => [],
                'current_page' => 55,
                'total' => 0,
            ]);
    }
    public function test_handles_non_existed_client_esoft_data()
    {
        // Create a user and associated ClientEsoft
        // Create a user
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        /*    // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]); */

        // Simulate authentication
        $this->actingAs($user);
        // No ClientB2B records for the given ClientEsoft
        $response = $this->getJson('/api/client_b2b/get_all_client_b2b?page=55'); // Adjust the endpoint as needed

        $response->assertStatus(404)
            ->assertJson([
                "msg" => "user not found",
            ]);
    }

    // deleteB2BClient

    public function test_it_deletes_b2b_client_successfully()
    {
        // Create a user ClientEsoft
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Simulate authentication
        $this->actingAs($user);

        $clientB2B = ClientB2B::factory()->create(['client_esoft_id' => $clientEsoft->id]);

        // Call the delete function
        $response = $this->postJson("/api/client_b2b/delete/" . $clientB2B->id);
        // dd(vars: $response->getContent());
        $response->assertStatus(200)
            ->assertJson(['message' => 'B2B client and associated projects deleted successfully']);
    }





    public function test_client_esoft_can_update_its_own_client_b2b()
    {
        // Arrange
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        $clientB2B = ClientB2B::factory()->create([
            'client_esoft_id' => $clientEsoft->id,
            'client_b2b_name' => 'Old Name',
        ]);

        // Act
        $response = $this->actingAs($user)->postJson(
            route('UpdateB2BClient', ['id' => $clientB2B->id]),
            ['name' => 'New Name']
        );

        // Assert
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'message' => 'Client B2B updated successfully',
        ]);

        $this->assertDatabaseHas('client_b2b', [
            'id' => $clientB2B->id,
            'client_b2b_name' => 'New Name',
        ]);
    }
    public function test_it_returns_404_when_client_esoft_is_missing()
    {
        // Arrange
        $user = User::factory()->create();

        $clientB2B = ClientB2B::factory()->create();

        // Act
        $response = $this->actingAs($user)->postJson(
            route('UpdateB2BClient', ['id' => $clientB2B->id]),
            ['name' => 'New Name']
        );

        // Assert
        $response->assertStatus(404);
    }
    public function test_it_returns_404_when_client_does_not_belong_to_user()
    {
        // Arrange
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        $clientB2B = ClientB2B::factory()->create([
            'client_esoft_id' => $clientEsoft->id,
        ]);

        // Act
        $response = $this->actingAs($user)->postJson(
            route('UpdateB2BClient', ['id' => $clientB2B->id]),
            ['name' => 'New Name']
        );

        // Assert
        $response->assertStatus(404);
    }
    public function test_it_fails_validation_when_name_is_missing()
    {
        // Arrange
        $user = User::factory()->create();
        ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Act
        $response = $this->actingAs($user)->postJson(
            route('UpdateB2BClient', ['id' => 1]),
            []
        );

        // Assert
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }
}
