<?php

namespace Tests\Feature;

use App\Enums\RoleEnumString;
use App\Models\ApplicationData;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class ApplicationDataControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Run the artisan command before each test
        $this->artisan(command: 'init-database')->run();
    }

    public function test_get_application_data_returns_first_record(): void
    {
        $user = User::factory()->withRole(RoleEnumString::Admin->value)->create([
            'email' => 'teddst@example.com',
            'is_valid' => false,
            'account_token' => null,
        ]);

        // Simulate authentication
        $this->actingAs($user);
        $data = ApplicationData::first();
        $response = $this->getJson(uri: route("getApplicationData"));

        $response->assertOk()
            ->assertJsonFragment([
                'id' => $data->id,
            ]);
    }

    public function test_update_application_data_successfully_updates_record()
    {
        $user = User::factory()->withRole(RoleEnumString::Admin->value)->create([
            'email' => 'teddst@example.com',
            'is_valid' => false,
            'account_token' => null,
        ]);

        // Simulate authentication
        $this->actingAs($user);
        $data = ApplicationData::first();

        $response = $this->postJson(route("updateApplicationData"), [
            'date_of_start_sending_notifications' => 1688745600,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(1688745600, $data->refresh()->date_of_start_sending_notifications);
    }

    public function test_update_application_data_fails_with_invalid_data()
    {
        $user = User::factory()->withRole(RoleEnumString::Admin->value)->create([
            'email' => 'teddst@example.com',
            'is_valid' => false,
            'account_token' => null,
        ]);

        // Simulate authentication
        $this->actingAs($user);
        $response = $this->postJson(route("updateApplicationData"), [
            'date_of_start_sending_notifications' => null,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['date_of_start_sending_notifications']);
    }
    public function test_update_logo_successfully_updates_logo()
    {
        $user = User::factory()->withRole(RoleEnumString::Admin->value)->create([
            'email' => 'teddst@example.com',
            'is_valid' => false,
            'account_token' => null,
        ]);

        // Simulate authentication
        $this->actingAs($user);
        $data = ApplicationData::first();

        $file = UploadedFile::fake()->image('logo.png');

        $response = $this->postJson(route("updateLogo"), [
            'logo' => $file,
        ]);

        $response->assertStatus(200);
        $data->refresh();
        $this->assertNotNull($data->logo);
    }

    public function test_update_logo_fails_with_invalid_file()
    {
        $user = User::factory()->withRole(RoleEnumString::Admin->value)->create([
            'email' => 'teddst@example.com',
            'is_valid' => false,
            'account_token' => null,
        ]);

        // Simulate authentication
        $this->actingAs($user);

        //  $file = UploadedFile::fake()->image('logo.png');

        $response = $this->postJson(route("updateLogo"), [
            'logo' => "not a file",
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['logo']);
    }
}
