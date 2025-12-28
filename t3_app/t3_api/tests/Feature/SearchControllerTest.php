<?php

namespace Tests\Feature;

use App\Enums\RoleEnumString;
use App\Models\ClientEsoft;
use App\Models\Consultant;
use App\Models\Manager;
use App\Models\User;
use App\Services\ExceptionMessagesService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class SearchControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
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
    public function test_it_returns_422_when_name_is_missing()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->getJson('/api/global-search');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }
    public function test_it_returns_422_when_page_is_invalid()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->getJson('/api/global-search?name=test&page=0');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['page']);
    }
    public function test_it_returns_data_for_client_esoft_role()
    {
        $user = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);
        $this->actingAs($user);

        $searchTerm = 'abc';

        $response = $this->getJson("/api/global-search?name={$searchTerm}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'absences',
                'activities',
                'clients',
                'projects',
                'users',
            ]);
    }
    public function test_it_returns_data_for_manager_role()
    {
        $user = User::factory()->withRole(RoleEnumString::Manager->value)->create();
        Manager::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user);
        $searchTerm = 'abc';

        $response = $this->getJson("/api/global-search?name={$searchTerm}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'absences',
                'activities',
                'projects',
                'users',
            ]);
    }
    public function test_it_returns_data_for_consultant_role()
    {
        $user = User::factory()->withRole(RoleEnumString::Consultant->value)->create();
        Consultant::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user);
        $searchTerm = 'abc';

        $response = $this->getJson("/api/global-search?name={$searchTerm}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'absences',
                'activities',
                'projects',
            ]);
    }

    /** @test */
    public function test_it_returns_error_for_invalid_role()
    {
        $user = User::factory()->withRole('ADMIN')->create();
        $this->actingAs($user);

        $searchTerm = 'abc';

        $response = $this->getJson("/api/global-search?name={$searchTerm}");

        $response->assertStatus(200)
            ->assertExactJson(ExceptionMessagesService::errorInvalidRole());
    }
}
