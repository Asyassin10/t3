<?php

namespace Tests\Feature;

use App\Enums\RoleEnumString;
use App\Models\Activite;
use App\Models\ClientB2B;
use App\Models\ClientEsoft;
use App\Models\Consultant;
use App\Models\ConsultantProject;
use App\Models\Manager;
use App\Models\Project;
use App\Models\ProjectManager;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Run the artisan command before each test
        $this->artisan(command: 'init-database')->run();
        //    $this->artisan(command: 'app:init-client-esoft')->run();
    }
    public function test_it_returns_all_activities_as_json()
    {
        // Create a user
        $user = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Simulate authentication
        $this->actingAs($user);

        // Arrange: Seed the database with test data
        Activite::factory()->count(3)->create();

        // Act: Call the GetAllActivities method
        $response = $this->getJson(route(name: 'GetAllActivities'));

        // Assert: Check the response structure and data
        $response->assertStatus(200);
        $response->assertJsonCount(3); // Assert that 3 records are returned
        $response->assertJsonStructure([
            [
                'id',
                'project_id',
                'activity_name',
                'user_id',
                'created_at',
                'updated_at',
            ],
        ]);
    }

    public function test_it_creates_an_activity_and_returns_json()
    {
        // Create a user
        $user = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Simulate authentication
        $this->actingAs($user);

        $user_manager = User::factory()->withRole(role_name: RoleEnumString::Manager->value)->create();

        $manager = Manager::factory()->create([
            'user_id' => $user_manager->id,
            'client_esoft_id' => $clientEsoft->id,
        ]);
        $client_b2b_factory = ClientB2B::factory()->create([
            "client_esoft_id" => $clientEsoft->id,
        ]);
        $project = Project::factory()->create(attributes: ['manager_id' => $manager->id, "client_b2b_id" => $client_b2b_factory->id, 'client_esoft_id' => $clientEsoft->id]);

        $payload = [
            'project_id' => $project->id,
            'activity_name' => 'Test Activity',
        ];

        // Act: Call the CreateActivity method
        $response = $this->postJson(route(name: 'CreateActivity'), $payload);

        // Assert: Check the response structure and data
        $response->assertStatus(status: 201);
        $response->assertJsonStructure([
            'id',
            'project_id',
            'activity_name',
            'user_id',
            'created_at',
            'updated_at',
        ]);

        // Assert: Verify the data in the database
        $this->assertDatabaseHas('activites', [
            'project_id' => $payload['project_id'],
            'activity_name' => $payload['activity_name'],
            'user_id' => $user->id,
        ]);
    }
    public function test_it_updates_an_activity_successfully()
    {
        $user = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        $this->actingAs($user);

        // Build full project chain
        $user_manager = User::factory()->withRole(RoleEnumString::Manager->value)->create();
        $manager = Manager::factory()->create([
            'user_id' => $user_manager->id,
            'client_esoft_id' => $clientEsoft->id,
        ]);

        $client_b2b = ClientB2B::factory()->create([
            'client_esoft_id' => $clientEsoft->id,
        ]);

        $project = Project::factory()->create([
            'manager_id' => $manager->id,
            'client_b2b_id' => $client_b2b->id,
            'client_esoft_id' => $clientEsoft->id,
        ]);

        $activity = Activite::factory()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
        ]);

        $payload = [
            "project_id" => $project->id,
            "activity_name" => "Updated Activity Name",
        ];

        $response = $this->putJson(
            route("UpdateActivity", ["id" => $activity->id]),
            $payload
        );

        $response->assertStatus(200)
            ->assertJsonFragment([
                "id" => $activity->id,
                "activity_name" => "Updated Activity Name",
            ]);

        $this->assertDatabaseHas("activites", [
            "id" => $activity->id,
            "activity_name" => "Updated Activity Name",
        ]);
    }

    public function test_it_fails_updating_non_existing_activity()
    {
        $user = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();

        ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        $this->actingAs($user);

        $payload = [
            "project_id" => 1,
            "activity_name" => "Anything"
        ];

        $response = $this->putJson(
            route("UpdateActivity", ["id" => 999999]),
            $payload
        );

        $response->assertStatus(404)
            ->assertJson([
                "msg" => "Activity not found",
            ]);
    }

    public function test_it_deletes_an_activity_successfully()
    {
        $user = User::factory()->withRole(RoleEnumString::Admin->value)->create();

        ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        $this->actingAs($user);

        $activity = Activite::factory()->create();

        $response = $this->deleteJson(
            route("deleteActivity", ["id" => $activity->id])
        );

        $response->assertStatus(200)
            ->assertJson([
                "message" => "activity deleted successfully",
            ]);

        $this->assertDatabaseMissing("activites", [
            "id" => $activity->id,
        ]);
    }

    public function test_it_fails_to_delete_non_existing_activity()
    {
        $user = User::factory()->withRole(RoleEnumString::Admin->value)->create();

        ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        $this->actingAs($user);

        $response = $this->deleteJson(
            route("deleteActivity", ["id" => 123456])
        );

        $response->assertStatus(404)
            ->assertJson([
                "msg" => "Activity not found",
            ]);
    }
    public function test_it_returns_activities_for_client_esoft()
    {
        $user = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();
        Activite::factory()->count(3)->create();

        $response = $this->actingAs($user)->getJson(route('GetAllActivities'));

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }
    public function test_it_returns_activities_for_manager_with_projects()
    {
        $user = User::factory()->withRole(RoleEnumString::Manager->value)->create();
        $manager = Manager::factory()->create(['user_id' => $user->id]);
        $project = Project::factory()->create();
        /*  ProjectManager::factory()->create([
            'manager_id' => $manager->id,
            'project_id' => $project->id
        ]); */
        $project->managers()->attach($manager->id, [
            "project_manager_price_per_day" => 22,
            'date_of_start' => now(),
            'date_of_end' => now()->addMonth(),
        ]);
        $activity = Activite::factory()->create([
            'user_id' => $user->id,
            'project_id' => $project->id
        ]);

        $response = $this->actingAs($user)->getJson(route('GetAllActivities'));

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $activity->id]);
    }
    public function test_it_returns_activities_for_consultant_with_projects()
    {
        $user = User::factory()->withRole(RoleEnumString::Consultant->value)->create();
        $consultant = Consultant::factory()->create(['user_id' => $user->id]);
        $project = Project::factory()->create();
        ConsultantProject::factory()->create([
            'consultant_id' => $consultant->id,
            'project_id' => $project->id
        ]);
        $activity = Activite::factory()->create([
            'user_id' => $user->id,
            'project_id' => $project->id
        ]);

        $response = $this->actingAs($user)->getJson(route('GetAllActivities'));

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $activity->id]);
    }
    public function test_it_returns_error_for_user_with_invalid_role()
    {
        $user = User::factory()->withRole(RoleEnumString::Admin->value)->create();

        $response = $this->actingAs($user)->getJson(route('GetAllActivities'));

        $response->assertStatus(200) // the controller returns JSON even for errors
            ->assertJson(['msg' => 'invalid role']); // match your ExceptionMessagesService output
    }
}
