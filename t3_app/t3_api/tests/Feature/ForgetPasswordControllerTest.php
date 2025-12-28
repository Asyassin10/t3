<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\CodeConfirmation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Tests\TestCase;

class ForgetPasswordControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Run the artisan command before each test
        $this->artisan(command: 'init-database')->run();
    }

    public function test_check_email_and_send_code_success()
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'test@example.com',
        ]);

        $response = $this->postJson(route("CheckEmailAndSendCode"), [
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Votre code de réinitialisation a été envoyé à votre adresse email.']);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);

        Notification::assertSentTo($user, notification: CodeConfirmation::class);
    }
    public function test_check_email_and_send_code_user_not_found()
    {
        $response = $this->postJson(route("CheckEmailAndSendCode"), [
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(404)
            ->assertJson(['message' => "Cette adresse email n'est pas enregistrée."]);
    }

    public function test_validate_code_success()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'code_otp' => 123456,
        ]);

        $response = $this->postJson(route("ValidateCode"), [
            'email' => 'test@example.com',
            'code_otp' => 123456,
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Code valide']);

        $this->assertNotNull($user->fresh()->token_change_mdp);
    }
    public function test_validate_code_invalid()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'code_otp' => 123456,
        ]);

        $response = $this->postJson(route("ValidateCode"), [
            'email' => 'test@example.com',
            'code_otp' => 654321,
        ]);

        $response->assertStatus(400)
            ->assertJson(['message' => 'Code invalide']);
    }
    public function test_reset_password_success()
    {
        $user = User::factory()->create([
            'token_change_mdp' => Str::random(80),
        ]);

        $response = $this->postJson(route("resetPassword"), [
            'token' => $user->token_change_mdp,
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Mot de passe modifié avec succès']);

        $this->assertTrue(condition: Hash::check('newpassword', $user->fresh()->password));
        $this->assertNull($user->fresh()->token_change_mdp);
    }
    public function test_reset_password_invalid_token()
    {
        $response = $this->postJson(route("resetPassword"), [
            'token' => 'invalid_token',
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ]);

        $response->assertStatus(404)
            ->assertJson(['message' => 'Token invalide']);
    }
}
