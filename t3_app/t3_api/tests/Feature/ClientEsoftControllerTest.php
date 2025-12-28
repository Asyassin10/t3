<?php

namespace Tests\Feature;

use App\Enums\RoleEnumString;
use App\Models\ClientB2B;
use App\Models\ClientEsoft;
use App\Models\User;
use App\Services\ClientB2BService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ClientEsoftControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Run the artisan command before each test
        $this->artisan(command: 'init-database')->run();
    }
    public function test_it_returns_404_when_b2b_client_does_not_exist()
    {
        // Arrange
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);
        $this->actingAs($user);

        // Act
        $response = $this->postJson(
            route('deleteB2BClient', ['id' => 999999])
        );

        // Assert
        $response->assertStatus(404)
            ->assertJson([
                'error' => 'B2B client not found',
            ]);
    }

    public function test_client_esoft_can_delete_own_client_b2b()
    {
        // Arrange
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        $clientB2B = ClientB2B::factory()->create([
            'client_esoft_id' => $clientEsoft->id,
        ]);

        // Mock service
        /*   $this->mock(ClientB2BService::class, function ($mock) {
            $mock->shouldReceive('deleteClientB2B')->once();
        });
 */
        // Act
        $response = $this->actingAs($user)->postJson(
            route('deleteB2BClient', ['id' => $clientB2B->id])
        );

        // Assert
        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'B2B client and associated projects deleted successfully',
        ]);
    }
    public function test_it_returns_404_when_client_not_found()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        $response = $this->actingAs($user)->postJson(
            route('deleteB2BClient', ['id' => 999])
        );

        $response->assertStatus(404);
        $response->assertJson([
            'error' => 'B2B client not found',
        ]);
    }

    public function test_it_returns_404_if_client_b2b_does_not_exist()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);
        $this->actingAs($user);

        $response = $this->postJson(route('deleteB2BClient', ['id' => 999999]));

        $response->assertStatus(404)
            ->assertJson(['error' => 'B2B client not found']);
    }
    public function it_deletes_client_b2b_when_user_is_owner()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $clientEsoft = ClientEsoft::factory()->create(['user_id' => $user->id]);

        $clientB2B = ClientB2B::factory()->create(['client_esoft_id' => $clientEsoft->id]);

        $response = $this->postJson(route('deleteB2BClient', ['id' => $clientB2B->id]));

        $response->assertStatus(200)
            ->assertJson(['message' => 'B2B client and associated projects deleted successfully']);

        $this->assertDatabaseMissing('client_b2_b_s', [
            'id' => $clientB2B->id,
        ]);
    }
    public function test_it_returns_403_if_authenticated_user_is_not_owner()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Another user owns the ClientB2B
        $otherUser = User::factory()->create();
        $otherClientEsoft = ClientEsoft::factory()->create(['user_id' => $otherUser->id]);

        $clientB2B = ClientB2B::factory()->create(['client_esoft_id' => $otherClientEsoft->id]);

        $response = $this->postJson(route('deleteB2BClient', ['id' => $clientB2B->id]));

        $response->assertStatus(403)
            ->assertJson(['error' => 'Unauthorized']);
    }
}
