<?php

namespace Tests\Feature;

use App\Enums\RoleEnumString;
use App\Models\User;
use App\Notifications\AccountActivationNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AdminControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Run the artisan command before each test
        $this->artisan(command: 'init-database')->run();
    }

    public function test_it_accepts_account_request_and_sends_activation_email(): void
    {
        // Create a user
        $user = User::factory()->withRole(RoleEnumString::Admin->value)->create([
            'email' => 'teddst@example.com',
            'is_valid' => false,
            'account_token' => null,
        ]);

        // Simulate authentication
        $this->actingAs($user);

        // Mock the notification system
        Notification::fake();
        $response = $this->postJson(uri: route("accept_account_request"), data: [
            'email' => 'teddst@example.com',
        ]);
        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Account request accepted. Activation email sent.',
        ]);
        $user->refresh();
        $this->assertEquals(1, $user->is_valid);
        $this->assertNotNull($user->account_token);
        Notification::assertSentTo(
            notifiable: [$user],
            notification: AccountActivationNotification::class,
            callback: function ($notification, $channels) use ($user) {
                return $notification->user->id === $user->id &&
                $notification->token === $user->account_token;
            }
        );
    }

    public function test_it_returns_error_for_invalid_email()
    {
        $user = User::factory()->withRole(RoleEnumString::Admin->value)->create([
            'email' => 'teddst@example.com',
            'is_valid' => false,
            'account_token' => null,
        ]);

        // Simulate authentication
        $this->actingAs($user);

        // Act: Call the endpoint with an invalid email
        $response = $this->postJson(uri: route("accept_account_request"), data: [
            'email' => 'invalid@example.com',
        ]);

        // Assert: Check the response
        $response->assertStatus(422);

        $response->assertJsonValidationErrors(['email']);
    }

    public function it_returns_error_when_user_not_found()
    {
        $user = User::factory()->withRole(RoleEnumString::Admin->value)->create([
            'email' => 'teddst@example.com',
            'is_valid' => false,
            'account_token' => null,
        ]);

        // Simulate authentication
        $this->actingAs($user);

        // Act: Call the endpoint with an invalid email
        $response = $this->postJson(uri: route("accept_account_request"), data: [
            'email' => 'notfound@example.com',
        ]);
        // Assert: Check the response
        $response->assertStatus(404);
        $response->assertJson(['message' => 'User not found.']);
    }
}
