<?php

namespace Tests\Feature;

use App\Enums\RoleEnumString;
use App\Models\AbsenceRequest;
use App\Models\Activite;
use App\Models\ClientB2B;
use App\Models\Consultant;
use App\Models\CRA;
use App\Models\Facture;
use App\Models\Manager;
use App\Models\Project;
use App\Models\User;
use App\Services\AccountService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ProfileControllerTest extends TestCase
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
    public function test_it_returns_user_profile_with_counts_for_client_esoft()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $this->actingAs($user);

        $this->mock(AccountService::class, function ($mock) {
            $mock->shouldReceive('getRoleById')
                ->andReturn((object)[
                    'role_name' => RoleEnumString::ClientEsoft->value
                ]);
        });

        // Seed some data
        ClientB2B::factory()->count(2)->create();
        Consultant::factory()->count(3)->create();
        Manager::factory()->count(1)->create();
        Project::factory()->count(4)->create();
        Facture::factory()->count(5)->create();
        Activite::factory()->count(6)->create();
        CRA::factory()->count(2)->create(['user_id' => $user->id]);
        AbsenceRequest::factory()->count(1)->create(['user_id' => $user->id]);

        $response = $this->getJson(route('profile'));
        /*     dd($response->json()); */
        $response->assertStatus(200)
            ->assertJsonStructure([
                'cras_count',
                'absences_count',
                'clients_count',
                'consultants_count',
                'managers_count',
                'projects_count',
                'factures_count',
                'activities_count',
                'user' => [
                    'id'
                ],
            ]);
    }
    public function it_updates_user_data_successfully()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com'
        ];

        $response = $this->postJson(route('updateUserData'), $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Updated Name',
                'email' => 'updated@example.com'
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com'
        ]);
    }

    /** @test */
    public function it_fails_user_data_validation_if_required_fields_missing()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson(route('updateUserData'), []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email']);
    }

    /** @test */
    public function it_updates_password_successfully()
    {
        $password = 'oldpassword';
        $user = User::factory()->create([
            'password' => Hash::make($password)
        ]);
        $this->actingAs($user);

        $payload = [
            'current_password' => $password,
            'new_password' => 'newpassword123',
            'new_password_confirmation' => 'newpassword123',
        ];

        $response = $this->postJson(route('updatePassword'), $payload);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Password updated successfully'
            ]);

        $this->assertTrue(Hash::check('newpassword123', $user->fresh()->password));
    }

    /** @test */
    public function it_returns_error_when_current_password_is_incorrect()
    {
        $user = User::factory()->create([
            'password' => Hash::make('correctpassword')
        ]);
        $this->actingAs($user);

        $payload = [
            'current_password' => 'wrongpassword',
            'new_password' => 'newpassword123',
            'new_password_confirmation' => 'newpassword123',
        ];

        $response = $this->postJson(route('updatePassword'), $payload);

        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Current password is incorrect'
            ]);
    }

    /** @test */
    public function it_fails_password_validation_if_fields_missing_or_confirmation_fails()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            'current_password' => 'short',
            'new_password' => '123456',
            'new_password_confirmation' => 'different'
        ];

        $response = $this->postJson(route('updatePassword'), $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password', 'new_password']);
    }
    /** @test */
    public function it_updates_user_data_and_returns_user_with_role()
    {
        // Create a user with a role
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
        ]);


        // Attach a role if using roles table


        $this->actingAs($user);

        $payload = [
            'name' => 'New Name',
            'email' => 'new@example.com'
        ];

        $response = $this->postJson(route('updateUserData'), $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'New Name',
                'email' => 'new@example.com',
            ])
            ->assertJsonStructure([
                'id',
                'name',
                'email',
                'role' // ensure role is loaded
            ]);

        // Check database
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'New Name',
            'email' => 'new@example.com'
        ]);
    }
}
