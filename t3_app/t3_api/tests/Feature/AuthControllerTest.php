<?php

namespace Tests\Feature;

use App\Enums\RoleEnumString;
use App\Models\ClientEsoft;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Run the artisan command before each test
        $this->artisan(command: 'init-database')->run();
    }

    public function test_update_kbis_file_successfully()
    {
        Storage::fake('public');

        $user = User::factory()
            ->withRole(RoleEnumString::ClientEsoft->value)
            ->create();

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
            'kbis_file' => null,
        ]);

        $this->actingAs($user);

        $file = UploadedFile::fake()->create(
            'kbis.pdf',
            500,
            'application/pdf'
        );

        $response = $this->postJson(route('updateKbisFile'), [
            'file_app' => $file,
        ]);

        $response->assertStatus(200)
            ->assertExactJson([]);

        $clientEsoft->refresh();

        $this->assertNotNull($clientEsoft->kbis_file);
    }
    public function test_update_kbis_file_validation_error_when_file_missing()
    {
        $user = User::factory()
            ->withRole(RoleEnumString::ClientEsoft->value)
            ->create();

        ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        $this->actingAs($user);

        $response = $this->postJson(route('updateKbisFile'), []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file_app']);
    }

    public function test_it_should_return_authenticated_user_data()
    {
        // Create a user with a role
        $user = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Simulate authentication
        $this->actingAs($user);

        // Call the /me endpoint with the Bearer token
        $response = $this->getJson(route('me'));

        $response->assertStatus(200)
            ->assertJson([
                'id' => $user->id,
                'email' => $user->email,
                // Optionally assert the role structure
                'role' => [
                    'id' => $user->role->id,
                    'role_name' => RoleEnumString::ClientEsoft->value,
                ],
            ])
            ->assertJsonStructure([
                'id',
                'name',
                'email',
                'role' => [
                    'id',
                    'role_name',
                ],
            ]);
    }

    public function test_it_should_return_validation_error_when_email_or_password_is_missing()
    {
        $response = $this->postJson(uri: route(name: "loginUser"), data: [
            'email' => '', // Missing email
            'password' => '', // Missing password
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_it_should_return_error_when_credentials_are_invalid()
    {
        $user = User::factory()->create([
            'password' => Hash::make('valid-password'),
        ]);

        $response = $this->postJson(uri: route(name: "loginUser"), data: [
            'email' => $user->email,
            'password' => 'invalid-password',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'status' => false,
                'message' => "L'e-mail et le mot de passe ne correspondent pas à notre dossier.",
            ]);
    }
    public function test_login_success_client_esoft_user()
    {
        // Create a user and role
        $user = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create([
            "password" => Hash::make("password"),
        ]);

        // Link ClientEsoft model
        ClientEsoft::factory()->create(['user_id' => $user->id]);

        $response = $this->postJson(uri: route(name: "loginUser"), data: [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'User Logged In Successfully',
            ])
            ->assertJsonStructure([
                'client_esoft',
                'user',
                'assigned_modules',
                'token',
            ]);
    }

    public function test_login_failled_without_client_esoft()
    {
        // Create a user with no ClientEsoft relationship
        // Create a user and role
        $user = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create([
            "password" => Hash::make("password"),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'status' => false,
                'message' => "L'e-mail et le mot de passe ne correspondent pas à notre dossier.",
            ]);
    }

    public function test_logout_success()
    {
        // Create a user
        $user = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create([
            "password" => Hash::make("password"),
        ]);

        // Generate an access token for the user
        $token = $user->createToken('API TOKEN')->plainTextToken;

        // Make the logout request with the token
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Logged out successfully',
            ]);

        // Verify the token is deleted
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }

    /**
     * Test logout without a valid token.
     */
    public function test_logout_unauthenticated()
    {
        // Make a logout request without providing a token
        $response = $this->postJson('/api/logout');

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
}
