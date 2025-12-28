<?php

namespace Tests\Feature;

use App\Enums\RoleEnumString;
use App\Models\ClientEsoft;
use App\Models\Consultant;
use App\Models\ConsultantProject;
use App\Models\Manager;
use App\Models\Project;
use App\Models\User;
use App\Services\ExceptionMessagesService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ConsultantControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Run the artisan command before each test
        $this->artisan(command: 'init-database')->run();
    }
    public function test_client_esoft_can_get_his_consultants()
    {
        $user = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();
        $user_concultant = User::factory()
            ->withRole(role_name: RoleEnumString::Consultant->value)
            ->create();

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        Consultant::factory()
            ->count(3)
            ->create([
                'client_esoft_id' => $clientEsoft->id,
                "user_id" => $user_concultant->id
            ]);

        $this->actingAs($user);

        $response = $this->getJson(route('GetConsultants'));

        $response
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'user',
                        'projects_count',
                    ],
                ],
                'links',
            ]);

        $this->assertCount(3, $response->json('data'));
    }
    public function test_manager_can_get_consultants_assigned_to_his_projects()
    {
        $managerUser = User::factory()
            ->withRole(role_name: RoleEnumString::Manager->value)
            ->create();
        $consultantUser = User::factory()
            ->withRole(role_name: RoleEnumString::Manager->value)
            ->create();

        $manager = Manager::factory()->create([
            'user_id' => $managerUser->id,
        ]);

        $consultant = Consultant::factory()->create([
            "user_id" => $consultantUser->id
        ]);

        $projet = Project::factory()->create([
            'manager_id' => $manager->id,
        ]);
        ConsultantProject::create([
            "consultant_id" => $consultant->id,
            "project_id" => $projet->id
        ]);

        $this->actingAs($managerUser);

        $response = $this->getJson(route('GetConsultants'));

        $response
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }
    public function test_client_esoft_can_filter_consultants_by_name_or_email()
    {
        $user = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        $consultant = Consultant::factory()->create([
            'client_esoft_id' => $clientEsoft->id,
        ]);

        $consultant->user()->update([
            'name' => 'John Consultant',
            'email' => 'john@test.com',
        ]);

        $this->actingAs($user);

        $response = $this->getJson(route('GetConsultants', [
            'value' => 'John',
        ]));

        $response
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.user.name', 'John Consultant');
    }

    public function test_it_returns_422_when_validation_fails()
    {
        $user = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();

        $this->actingAs($user);

        $response = $this->getJson(route('GetConsultants', [
            'page' => 0, // invalid
        ]));

        $response
            ->assertStatus(422)
            ->assertJsonStructure([
                'errors' => ['page'],
            ]);
    }
    public function test_it_returns_invalid_role_when_user_role_is_not_allowed()
    {
        $user = User::factory()
            ->withRole(role_name: RoleEnumString::Consultant->value)
            ->create();

        $this->actingAs($user);

        $response = $this->getJson(route('GetConsultants'));

        $response
            ->assertOk()
            ->assertJson(ExceptionMessagesService::errorInvalidRole());
    }
    public function test_it_returns_invalid_role_when_user_role_is_not_allowed_paginated_route()
    {
        $user = User::factory()
            ->withRole(role_name: RoleEnumString::Consultant->value)
            ->create();

        $this->actingAs($user);

        $response = $this->getJson(route('GetConsultantsNonPaginated'));

        $response
            ->assertOk()
            ->assertJson(ExceptionMessagesService::errorInvalidRole());
    }
    public function test_it_returns_422_when_validation_fails_paginated_route()
    {
        $user = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();

        $this->actingAs($user);

        $response = $this->getJson(route('GetConsultantsNonPaginated', [
            'page' => 0, // invalid
        ]));

        $response
            ->assertStatus(422)
            ->assertJsonStructure([
                'errors' => ['page'],
            ]);
    }
    // --------------- paginated_route


    public function test_client_esoft_can_get_his_consultants_paginated_route()
    {
        $user = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();
        $user_concultant = User::factory()
            ->withRole(role_name: RoleEnumString::Consultant->value)
            ->create();

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        Consultant::factory()
            ->count(3)
            ->create([
                'client_esoft_id' => $clientEsoft->id,
                "user_id" => $user_concultant->id
            ]);

        $this->actingAs($user);

        $response = $this->getJson(route('GetConsultantsNonPaginated'));

        $response
            ->assertOk()
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'user',
                    'projects_count',
                ],
            ]);

        $this->assertCount(3, $response->json());
    }
    public function test_manager_can_get_consultants_assigned_to_his_projects_paginated_route()
    {
        $managerUser = User::factory()
            ->withRole(role_name: RoleEnumString::Manager->value)
            ->create();
        $consultantUser = User::factory()
            ->withRole(role_name: RoleEnumString::Manager->value)
            ->create();

        $manager = Manager::factory()->create([
            'user_id' => $managerUser->id,
        ]);

        $consultant = Consultant::factory()->create([
            "user_id" => $consultantUser->id
        ]);

        $projet = Project::factory()->create([
            'manager_id' => $manager->id,
        ]);
        ConsultantProject::create([
            "consultant_id" => $consultant->id,
            "project_id" => $projet->id
        ]);

        $this->actingAs($managerUser);

        $response = $this->getJson(route('GetConsultantsNonPaginated'));

        $response
            ->assertOk()
            ->assertJsonCount(1);
    }
    public function test_client_esoft_can_filter_consultants_by_name_or_email_paginated_route()
    {
        $user = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();
        $user_consultant = User::factory()
            ->withRole(role_name: RoleEnumString::Consultant->value)
            ->create([
                'name' => 'John Consultant',
                'email' => 'john@test.com',
            ]);

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        $consultant = Consultant::factory()->create([
            'client_esoft_id' => $clientEsoft->id,
            "user_id" => $user_consultant->id
        ]);



        $this->actingAs($user);

        $response = $this->getJson(route('GetConsultantsNonPaginated', [
            'value' => 'John',
        ]));
        $response
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.user.name', 'John Consultant');
    }
    public function test_manager_can_filter_consultants_by_name()
    {
        $managerUser = User::factory()
            ->withRole(role_name: RoleEnumString::Manager->value)
            ->create();

        $manager = Manager::factory()->create([
            'user_id' => $managerUser->id,
        ]);

        // Matching consultant
        $matchingUser = User::factory()->create([
            'name' => 'Alice Consultant',
            'email' => 'alice@test.com',
        ]);

        $matchingConsultant = Consultant::factory()->create([
            'user_id' => $matchingUser->id,
        ]);

        // Non-matching consultant
        $otherUser = User::factory()->create([
            'name' => 'Bob Consultant',
            'email' => 'bob@test.com',
        ]);

        $otherConsultant = Consultant::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        $project = Project::factory()->create([
            'manager_id' => $manager->id,
        ]);

        ConsultantProject::insert([
            [
                'consultant_id' => $matchingConsultant->id,
                'project_id' => $project->id,
            ],
            [
                'consultant_id' => $otherConsultant->id,
                'project_id' => $project->id,
            ],
        ]);

        $this->actingAs($managerUser);

        $response = $this->getJson(route('GetConsultants', [
            'value' => 'Alice',
        ]));

        $response
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.user.name', 'Alice Consultant');
    }
    public function test_manager_can_filter_consultants_by_name_non_paginated()
    {
        $managerUser = User::factory()
            ->withRole(role_name: RoleEnumString::Manager->value)
            ->create();

        $manager = Manager::factory()->create([
            'user_id' => $managerUser->id,
        ]);

        // Matching consultant
        $matchingUser = User::factory()->create([
            'name' => 'Alice Consultant',
            'email' => 'alice@test.com',
        ]);

        $matchingConsultant = Consultant::factory()->create([
            'user_id' => $matchingUser->id,
        ]);

        // Non-matching consultant
        $otherUser = User::factory()->create([
            'name' => 'Bob Consultant',
            'email' => 'bob@test.com',
        ]);

        $otherConsultant = Consultant::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        $project = Project::factory()->create([
            'manager_id' => $manager->id,
        ]);

        ConsultantProject::insert([
            [
                'consultant_id' => $matchingConsultant->id,
                'project_id' => $project->id,
            ],
            [
                'consultant_id' => $otherConsultant->id,
                'project_id' => $project->id,
            ],
        ]);

        $this->actingAs($managerUser);

        $response = $this->getJson(route('GetConsultantsNonPaginated', [
            'value' => 'Alice',
        ]));

        $response
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.user.name', 'Alice Consultant');
    }
    public function test_manager_can_filter_consultants_by_email()
    {
        $managerUser = User::factory()
            ->withRole(role_name: RoleEnumString::Manager->value)
            ->create();

        $manager = Manager::factory()->create([
            'user_id' => $managerUser->id,
        ]);

        $user = User::factory()->create([
            'name' => 'Random Name',
            'email' => 'special@email.com',
        ]);

        $consultant = Consultant::factory()->create([
            'user_id' => $user->id,
        ]);

        $project = Project::factory()->create([
            'manager_id' => $manager->id,
        ]);

        ConsultantProject::create([
            'consultant_id' => $consultant->id,
            'project_id' => $project->id,
        ]);

        $this->actingAs($managerUser);

        $response = $this->getJson(route('GetConsultants', [
            'value' => 'special@email.com',
        ]));

        $response
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.user.email', 'special@email.com');
    }
    public function test_manager_can_filter_consultants_by_email_non_paginated()
    {
        $managerUser = User::factory()
            ->withRole(role_name: RoleEnumString::Manager->value)
            ->create();

        $manager = Manager::factory()->create([
            'user_id' => $managerUser->id,
        ]);

        $user = User::factory()->create([
            'name' => 'Random Name',
            'email' => 'special@email.com',
        ]);

        $consultant = Consultant::factory()->create([
            'user_id' => $user->id,
        ]);

        $project = Project::factory()->create([
            'manager_id' => $manager->id,
        ]);

        ConsultantProject::create([
            'consultant_id' => $consultant->id,
            'project_id' => $project->id,
        ]);

        $this->actingAs($managerUser);

        $response = $this->getJson(route('GetConsultantsNonPaginated', [
            'value' => 'special@email.com',
        ]));

        $response
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.user.email', 'special@email.com');
    }
    public function test_client_esoft_filter_returns_empty_when_value_does_not_match()
    {
        $user = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        $consultantUser = User::factory()->create([
            'name' => 'John Consultant',
            'email' => 'john@test.com',
        ]);

        Consultant::factory()->create([
            'client_esoft_id' => $clientEsoft->id,
            'user_id' => $consultantUser->id,
        ]);

        $this->actingAs($user);

        $response = $this->getJson(route('GetConsultants', [
            'value' => 'DoesNotExist',
        ]));

        $response
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }
    public function test_client_esoft_filter_returns_empty_when_value_does_not_match_non_paginated()
    {
        $user = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        $consultantUser = User::factory()->create([
            'name' => 'John Consultant',
            'email' => 'john@test.com',
        ]);

        Consultant::factory()->create([
            'client_esoft_id' => $clientEsoft->id,
            'user_id' => $consultantUser->id,
        ]);

        $this->actingAs($user);

        $response = $this->getJson(route('GetConsultantsNonPaginated', [
            'value' => 'DoesNotExist',
        ]));

        $response
            ->assertOk()
            ->assertJsonCount(0);
    }
    public function test_client_esoft_can_create_consultant()
    {
        Notification::fake();

        $clientUser = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $clientUser->id,
        ]);

        $this->actingAs($clientUser);

        $payload = [
            'name' => 'John Consultant',
            'email' => 'john.consultant@test.com',
            'professionality' => 'Senior Backend Developer',
        ];

        $response = $this->postJson(route('CreateConsultant'), $payload);

        $response
            ->assertOk()
            ->assertJsonStructure([
                'id',
                'user_id',
                'professionality',
                'client_esoft_id',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john.consultant@test.com',
            'is_valid' => false,
        ]);

        $this->assertDatabaseHas('consultants', [
            'client_esoft_id' => $clientEsoft->id,
            'professionality' => 'Senior Backend Developer',
        ]);

        $user = User::where('email', 'john.consultant@test.com')->first();

        Notification::assertSentTo(
            [$user],
            \App\Notifications\NotifyConcultantCreationAccount::class
        );
    }
    public function test_create_consultant_fails_when_email_is_missing()
    {
        $clientUser = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();

        ClientEsoft::factory()->create([
            'user_id' => $clientUser->id,
        ]);

        $this->actingAs($clientUser);

        $response = $this->postJson(route('CreateConsultant'), [
            'name' => 'John',
            'professionality' => 'Backend',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }
    public function test_create_consultant_fails_when_email_is_not_unique()
    {
        $existingUser = User::factory()->create([
            'email' => 'duplicate@test.com',
        ]);

        $clientUser = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();

        ClientEsoft::factory()->create([
            'user_id' => $clientUser->id,
        ]);

        $this->actingAs($clientUser);

        $response = $this->postJson(route('CreateConsultant'), [
            'name' => 'John',
            'email' => 'duplicate@test.com',
            'professionality' => 'Backend',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }
    public function test_create_consultant_fails_when_client_esoft_not_found()
    {
        $user = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();

        // ❌ No ClientEsoft record created

        $this->actingAs($user);

        $response = $this->postJson(route('CreateConsultant'), [
            'name' => 'John',
            'email' => 'john@test.com',
            'professionality' => 'Backend',
        ]);

        $response
            ->assertOk()
            ->assertJson(ExceptionMessagesService::errorUserNotFound());
    }
    public function test_created_user_has_consultant_role()
    {
        $clientUser = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();

        ClientEsoft::factory()->create([
            'user_id' => $clientUser->id,
        ]);

        $this->actingAs($clientUser);

        $this->postJson(route('CreateConsultant'), [
            'name' => 'Role Test',
            'email' => 'role@test.com',
            'professionality' => 'QA',
        ]);

        $user = User::where('email', 'role@test.com')->first();

        $this->assertEquals(
            RoleEnumString::Consultant->value,
            $user->role->role_name
        );
    }
    public function test_assign_consultant_to_project_fails_validation()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson(route('AssignConcultantToProject'), []);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'consultant_id',
                'price_per_day',
                'project_id',
            ]);
    }
    public function test_it_assigns_consultant_to_project_successfully()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $consultant = Consultant::factory()->create();
        $project = Project::factory()->create();

        $payload = [
            'consultant_id' => $consultant->id,
            'project_id' => $project->id,
            'price_per_day' => 500,
        ];

        $response = $this->postJson(route('AssignConcultantToProject'), $payload);

        $response
            ->assertStatus(201)
            ->assertJsonStructure([
                'consultant_id',
                'project_id',
                'price_per_day',
            ]);

        $this->assertDatabaseHas('consultant_projects', [
            'consultant_id' => $consultant->id,
            'project_id' => $project->id,
            'price_per_day' => 500,
        ]);
    }
    public function test_it_returns_existing_assignment_if_already_exists()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $consultant = Consultant::factory()->create();
        $project = Project::factory()->create();

        // Attach consultant to project instead of creating pivot directly
        $project->consultants()->attach($consultant->id, [
            'price_per_day' => 400,
        ]);

        // Retrieve the pivot record to get its ID
        $existingId = DB::table('consultant_projects')
            ->where('consultant_id', $consultant->id)
            ->where('project_id', $project->id)
            ->value('id');

        $response = $this->postJson(route('AssignConcultantToProject'), [
            'consultant_id' => $consultant->id,
            'project_id' => $project->id,
            'price_per_day' => 999, // should be ignored
        ]);


        $response
            ->assertOk()
            ->assertJsonFragment([
                'id' => $existingId,
                'consultant_id' => $consultant->id,
                'project_id' => $project->id,
                'price_per_day' => 400,
            ]);

        $this->assertDatabaseCount('consultant_projects', 1);
    }
    public function test_assign_consultant_fails_when_price_is_not_numeric()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $consultant = Consultant::factory()->create();
        $project = Project::factory()->create();

        $response = $this->postJson(route('AssignConcultantToProject'), [
            'consultant_id' => $consultant->id,
            'project_id' => $project->id,
            'price_per_day' => 'invalid',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['price_per_day']);
    }
}
