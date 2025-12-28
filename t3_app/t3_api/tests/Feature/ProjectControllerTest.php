<?php

namespace Tests\Feature;

use App\Enums\ProjectStatusEnum;
use App\Enums\RoleEnumString;
use App\Models\ClientB2B;
use App\Models\ClientEsoft;
use App\Models\Consultant;
use App\Models\ConsultantProject;
use App\Models\Manager;
use App\Models\Project;
use App\Models\ProjectManager;
use App\Models\User;
use App\Services\ExceptionMessagesService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class ProjectControllerTest extends TestCase
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
    public function test_client_esoft_can_create_project(): void
    {
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Attach ClientEsoft to user
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user_client_esoft->id,
        ]);

        // Create B2B client
        $clientB2B = ClientB2B::factory()->create();

        $this->actingAs($user_client_esoft);

        $payload = [
            'client_b2b_id' => $clientB2B->id,
            'dure' => 10,
            'project_name' => 'Test Project',
            'info' => 'Some info',
            'codeprojet' => 'PRJ-001',
        ];

        $response = $this->postJson(route('CreateProject'), $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'project_name' => 'Test Project',
                'codeprojet' => 'PRJ-001',
            ]);

        $this->assertDatabaseHas('projects', [
            'project_name' => 'Test Project',
            'client_esoft_id' => $clientEsoft->id,
        ]);
    }
    public function test_client_esoft_can_delete_own_project(): void
    {
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();


        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user_client_esoft->id,
        ]);

        $project = Project::factory()->create([
            'project_name' => 'Test Project',
            'client_esoft_id' => $clientEsoft->id,
        ]);
        Log::info('Created project : ' . json_encode($project->toArray()));
        Log::info('Client esoft : ' . json_encode($clientEsoft->toArray()));

        $this->actingAs($user_client_esoft);

        $response = $this->postJson(route('deleteProject', $project->id));

        $response->assertStatus(200)->assertJson([
            'message' => 'Project deleted successfully',
        ]);
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
        ]);
    }
    public function test_get_projects_fails_when_not_authenticated(): void
    {
        $user_client_esoft = User::factory()->create();
        $this->actingAs($user_client_esoft);
        $response = $this->getJson(route('GetAllProjects', ['page' => 1]));

        $response->assertStatus(200)
            ->assertJsonFragment([
                'msg' => "user not found",
            ]);
    }
    public function test_client_esoft_gets_own_projects(): void
    {
        $user = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        $projects = Project::factory()->count(3)->create([
            'client_esoft_id' => $clientEsoft->id,
        ]);

        // noise
        Project::factory()->count(2)->create();

        $this->actingAs($user);

        $response = $this->getJson(route('GetAllProjects', ['page' => 1]));

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }
    public function test_consultant_gets_assigned_projects(): void
    {
        $clientEsoftUser = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $clientEsoftUser->id,
        ]);

        $consultantUser = User::factory()->withRole(RoleEnumString::Consultant->value)->create();

        $consultant = Consultant::create([
            'user_id' => $consultantUser->id,
            'professionality' => 'senior',
            'client_esoft_id' => $clientEsoft->id,
        ]);

        $projects = Project::factory()->count(2)->create([
            'client_esoft_id' => $clientEsoft->id,
        ]);

        foreach ($projects as $project) {
            ConsultantProject::create([
                'consultant_id' => $consultant->id,
                'project_id' => $project->id,
                'price_per_day' => 400,
            ]);
        }

        $this->actingAs($consultantUser);

        $response = $this->getJson(route('GetAllProjects', ['page' => 1]));

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }
    public function test_manager_gets_managed_projects(): void
    {
        $clientEsoftUser = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $clientEsoftUser->id,
        ]);

        $managerUser = User::factory()->withRole(RoleEnumString::Manager->value)->create();

        $manager = Manager::create([
            'user_id' => $managerUser->id,
            'client_esoft_id' => $clientEsoft->id,
        ]);

        $projects = Project::factory()->count(2)->create([
            'manager_id' => $manager->id,
            'client_esoft_id' => $clientEsoft->id,
        ]);

        foreach ($projects as $project) {
            ProjectManager::create([
                'project_id' => $project->id,
                'manager_id' => $manager->id,
                'project_manager_price_per_day' => 150,
                'date_of_start' => now()->toDateString(),
            ]);
        }

        $this->actingAs($managerUser);

        $response = $this->getJson(route('GetAllProjects', ['page' => 1]));

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }
    public function test_can_assign_project_to_manager(): void
    {
        // Create ClientEsoft
        $clientUser = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $clientUser->id,
        ]);

        // Create Manager
        $managerUser = User::factory()->withRole(RoleEnumString::Manager->value)->create();
        $manager = Manager::create([
            'user_id' => $managerUser->id,
            'client_esoft_id' => $clientEsoft->id,
        ]);

        // Create Project
        $project = Project::factory()->create([
            'client_esoft_id' => $clientEsoft->id,
        ]);

        $this->actingAs($clientUser);

        $payload = [
            'project_id' => (string) $project->id,
            'manager_id' => $manager->id,
            'project_manager_price_per_day' => 200,
        ];

        $response = $this->postJson(route('AssignProjectToManager'), $payload);

        $response->assertStatus(200);

        // Assert project updated
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'manager_id' => $manager->id,
        ]);

        // Assert pivot row created
        $this->assertDatabaseHas('project_managers', [
            'project_id' => $project->id,
            'manager_id' => $manager->id,
            'project_manager_price_per_day' => 200,
        ]);
    }
    public function test_assign_fails_if_project_not_found(): void
    {
        $user = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();
        $this->actingAs($user);

        $payload = [
            'project_id' => '999999',
            'manager_id' => 1,
            'project_manager_price_per_day' => 200,
        ];

        $response = $this->postJson(route('AssignProjectToManager'), $payload);

        $response->assertStatus(404)
            ->assertJson([
                'msg' => 'project not found',
            ]);
    }

    /** ❌ FAIL: manager not found */
    public function test_assign_fails_if_manager_not_found(): void
    {
        $clientUser = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $clientUser->id,
        ]);

        $project = Project::factory()->create([
            'client_esoft_id' => $clientEsoft->id,
        ]);

        $this->actingAs($clientUser);

        $payload = [
            'project_id' => (string) $project->id,
            'manager_id' => 999999,
            'project_manager_price_per_day' => 200,
        ];

        $response = $this->postJson(route('AssignProjectToManager'), $payload);

        $response->assertStatus(404)
            ->assertJson([
                'msg' => 'manager not found',
            ]);
    }

    /** ✅ OK: do nothing if same manager already assigned */
    public function test_assign_returns_null_if_same_manager(): void
    {
        $clientUser = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $clientUser->id,
        ]);

        $managerUser = User::factory()->withRole(RoleEnumString::Manager->value)->create();
        $manager = Manager::create([
            'user_id' => $managerUser->id,
            'client_esoft_id' => $clientEsoft->id,
        ]);

        $project = Project::factory()->create([
            'client_esoft_id' => $clientEsoft->id,
            'manager_id' => $manager->id,
        ]);

        // Existing relation
        ProjectManager::create([
            'project_id' => $project->id,
            'manager_id' => $manager->id,
            'project_manager_price_per_day' => 200,
            'date_of_start' => now()->toDateString(),
        ]);

        $this->actingAs($clientUser);

        $payload = [
            'project_id' => (string) $project->id,
            'manager_id' => $manager->id,
            'project_manager_price_per_day' => 200,
        ];

        $response = $this->postJson(route('AssignProjectToManager'), $payload);

        $response->assertStatus(200)->assertJson([
            'msg' => 'manager already assigned to this project',
        ]);

        // Should not create duplicate record
        $this->assertEquals(1, ProjectManager::where('project_id', $project->id)->count());
    }
    public function test_it_returns_404_if_project_not_found()
    {
        $clientUser = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $clientUser->id,
        ]);
        $this->actingAs($clientUser);


        $manager = Manager::factory()->create();

        $response = $this->postJson(route('UnAssignProjectToManager'), [
            'project_id' => '9999',
            'manager_id' => $manager->id,
            'project_manager_price_per_day' => 100,
        ]);

        $response->assertStatus(404)
            ->assertJson([
                'msg' => 'project not found'
            ]);
    }
    public function test_it_returns_404_if_manager_not_found()
    {
        $clientUser = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $clientUser->id,
        ]);
        $this->actingAs($clientUser);
        $project = Project::factory([
            "client_esoft_id" => $clientEsoft->id,
        ])->create();

        $response = $this->postJson(route('UnAssignProjectToManager'), [
            'project_id' => (string) $project->id,
            'manager_id' => 9999,
            'project_manager_price_per_day' => 100,
        ]);

        $response->assertStatus(404)
            ->assertJson([
                'msg' => 'manager not found'
            ]);
    }
    public function test_it_returns_200_if_manager_is_not_assigned_to_project()
    {
        $clientUser = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $clientUser->id,
        ]);
        $this->actingAs($clientUser);
        $manager = Manager::factory()->create();
        $project  = Project::factory()->create([
            'manager_id' => null
        ]);

        $response = $this->postJson(route('UnAssignProjectToManager'), [
            'project_id' => (string) $project->id,
            'manager_id' => $manager->id,
            'project_manager_price_per_day' => 100,
        ]);

        $response->assertStatus(200)
            ->assertJson(['msg' => 'manager is not assigned to this project']);
    }
    public function test_it_unassigns_manager_from_project_successfully()
    {
        $clientUser = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $clientUser->id,
        ]);
        $this->actingAs($clientUser);
        $manager = Manager::factory()->create();
        $project = Project::factory()->create([
            'manager_id' => $manager->id
        ]);

        ProjectManager::factory()->create([
            'project_id' => $project->id,
            'manager_id' => $manager->id,
            'date_of_end' => null,
        ]);

        $response = $this->postJson(route('UnAssignProjectToManager'), [
            'project_id' => (string) $project->id,
            'manager_id' => $manager->id,
            'project_manager_price_per_day' => 100,
        ]);

        $response->assertStatus(200)
            ->assertJson(['msg' => 'manager unassigned from project successfully']);

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'manager_id' => null,
        ]);

        $this->assertDatabaseHas('project_managers', [
            'project_id' => $project->id,
            'manager_id' => $manager->id,
            'date_of_end' => Carbon::now()->toDateString(),
        ]);
    }
    public function test_get_all_project_status_returns_all_values(): void
    {
        $clientUser = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $clientUser->id,
        ]);
        $this->actingAs($clientUser);
        $response = $this->getJson(route('GetAllProjectStatus'));

        $response->assertStatus(200)
            ->assertJson([
                'status' => ProjectStatusEnum::values(),
            ]);

        // Ensure exact count
        $this->assertCount(
            count(ProjectStatusEnum::cases()),
            $response->json('status')
        );
    }

    /** ✅ structure is correct */
    public function test_get_all_project_status_response_structure(): void
    {
        $clientUser = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $clientUser->id,
        ]);
        $this->actingAs($clientUser);
        $response = $this->getJson(route('GetAllProjectStatus'));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
            ]);
    }

    /** ✅ contains specific values */
    public function test_get_all_project_status_contains_expected_values(): void
    {
        $clientUser = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $clientUser->id,
        ]);
        $this->actingAs($clientUser);
        $response = $this->getJson(route('GetAllProjectStatus'));

        $statuses = $response->json('status');

        $this->assertContains(ProjectStatusEnum::Pending->value, $statuses);
        $this->assertContains(ProjectStatusEnum::VALID->value, $statuses);
        $this->assertContains(ProjectStatusEnum::NOT_VALID->value, $statuses);
        $this->assertContains(ProjectStatusEnum::InProgress->value, $statuses);
    }








    public function test_consultant_can_get_paginated_projects()
    {
        $user = User::factory()->withRole(RoleEnumString::Consultant->value)->create();

        $consultant = Consultant::factory()->create([
            'user_id' => $user->id
        ]);

        $projects = Project::factory()->count(6)->create();
        foreach ($projects as $project) {
            ConsultantProject::create([
                'consultant_id' => $consultant->id,
                'project_id' => $project->id,
                'price_per_day' => 400,
            ]);
        }

        /*  $consultant->projects()->attach($projects->pluck('id')); */


        $this->actingAs($user);

        $response = $this->getJson(route('GetAllProjectsQuery'));
        Log::info('Response: ' . $response->getContent());
        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'links']);
    }
    public function test_client_esoft_can_get_paginated_projects()
    {
        $user = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();
        $clientb2b = ClientB2B::factory()->create();


        $client = ClientEsoft::factory()->create([
            'user_id' => $user->id
        ]);

        Project::factory()->count(5)->create([
            'client_b2b_id' => $clientb2b->id
        ]);

        $this->actingAs($user);

        $response = $this->getJson(route('GetAllProjectsQuery'));

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'links']);
    }
    public function test_manager_can_get_paginated_projects()
    {
        $user = User::factory()->withRole(RoleEnumString::Manager->value)->create();

        $manager = Manager::factory()->create([
            'user_id' => $user->id
        ]);

        Project::factory()->count(4)->create([
            'manager_id' => $manager->id
        ]);

        $this->actingAs($user);

        $response = $this->getJson(route('GetAllProjectsQuery'));

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'links']);
    }

    /** @test */
    public function test_it_returns_user_not_found_if_related_role_model_is_missing()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->getJson(route('GetAllProjectsQuery'));

        $response->assertStatus(200)
            ->assertJsonFragment(
                ExceptionMessagesService::errorUserNotFound()
            );
    }
}
