<?php

namespace Tests\Feature;

use App\Enums\RoleEnumString;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LanguageControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Run the artisan command before each test
        $this->artisan(command: 'init-database')->run();
    }
    /**
     * A basic feature test example.
     */
    public function test_if_authenticated_user_can_set_language()
    {

        $user = User::factory()->withRole(role_name: RoleEnumString::Manager->value)->create([
            'language' => 'en',
        ]);


        Sanctum::actingAs($user, ['*']);

        $response = $this->postJson(route("setLang"), [
            'lang' => 'fr',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Operation done successfully',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'language' => 'fr',
        ]);
    }
    public function test_if_set_language_requires_valid_lang()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        // Invalid language
        $response = $this->postJson(route("setLang"), [
            'lang' => 'es',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('lang');
    }
    public function test_unauthenticated_user_cannot_set_language()
    {
        $response = $this->postJson(route("setLang"), [
            'lang' => 'fr',
        ]);

        $response->assertStatus(401);
    }
    public function test_authenticated_user_can_get_language()
    {
        $user = User::factory()->create([
            'language' => 'en',
        ]);

        Sanctum::actingAs($user, ['*']);

        $response = $this->getJson(route("getLang"));

        $response->assertStatus(200)
            ->assertJson([
                'lang' => 'en',
            ]);
    }
    public function test_unauthenticated_user_cannot_get_language()
    {
        $response = $this->getJson(route("getLang"));

        $response->assertStatus(401);
    }
}
