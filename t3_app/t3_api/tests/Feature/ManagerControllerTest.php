<?php

namespace Tests\Feature;

use App\Enums\RoleEnumString;
use App\Models\ClientEsoft;
use App\Models\Consultant;
use App\Models\Manager;
use App\Models\Project;
use App\Models\User;
use App\Notifications\NotifyManagerCreationAccount;
use App\Services\AccountService;
use App\Services\ExceptionMessagesService;
use App\Services\UserClientEsoftService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str as SupportStr;
use Psy\Util\Str;
use Tests\TestCase;

class ManagerControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;
    protected function setUp(): void
    {
        parent::setUp();

        // Run the artisan command before each test
        $this->artisan(command: 'init-database')->run();
    }
    public function test_get_managers_fails_validation_when_page_is_invalid()
    {
        $user = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();

        $this->actingAs($user);

        $response = $this->getJson(route('GetManagers', [
            'page' => 0, // ❌ invalid (min:1)
        ]));

        $response
            ->assertStatus(422)
            ->assertJsonStructure([
                'errors' => ['page'],
            ]);
    }
    public function test_client_esoft_can_filter_managers_by_name()
    {
        $user = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();

        $client = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Matching manager
        $matchingManagerUser = User::factory()->create([
            'name' => 'John Manager',
            'email' => 'john__.manager@test.com',
        ]);

        Manager::factory()->create([
            'user_id' => $matchingManagerUser->id,
            'client_esoft_id' => $client->id,
        ]);

        // Non-matching manager
        $otherManagerUser = User::factory()->create([
            'name' => 'Alice Manager',
            'email' => 'alice@test.com',
        ]);

        Manager::factory()->create([
            'user_id' => $otherManagerUser->id,
            'client_esoft_id' => $client->id,
        ]);

        // Mock role resolution
        $this->mock(AccountService::class, function ($mock) {
            $mock->shouldReceive('getRoleById')
                ->andReturn((object)[
                    'role_name' => RoleEnumString::ClientEsoft->value,
                ]);
        });

        $this->actingAs($user);

        $response = $this->getJson(route('GetManagers', [
            'value' => 'John',
        ]));

        $response
            ->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.user.name', 'John Manager');
    }
    public function test_client_esoft_can_filter_managers_by_email()
    {
        $user = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();

        $client = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);
        $email = $this->faker->email;

        $managerUser = User::factory()->create([
            'name' => 'Random Name',
            'email' => $email,
        ]);

        Manager::factory()->create([
            'user_id' => $managerUser->id,
            'client_esoft_id' => $client->id,
        ]);

        $this->mock(AccountService::class, function ($mock) {
            $mock->shouldReceive('getRoleById')
                ->andReturn((object)[
                    'role_name' => RoleEnumString::ClientEsoft->value,
                ]);
        });

        $this->actingAs($user);

        $response = $this->getJson(route('GetManagers', [
            'value' => $email,
        ]));

        $response
            ->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.user.email', $email);
    }

    public function test_it_returns_invalid_user_or_role_when_user_is_not_authenticated()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::Manager->value)->create();

        $this
            ->actingAs($user)
            ->getJson(route('GetManagers') . '?page=1')
            ->assertStatus(200)
            ->assertJson([
                'msg' => 'Invalid user or role'
            ]);
    }
    public function test_it_returns_invalid_user_or_role_when_role_is_not_client_esoft()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::Manager->value)->create();

        $this->mock(AccountService::class, function ($mock) {
            $mock->shouldReceive('getRoleById')
                ->andReturn((object)[
                    'role_name' => 'SomeOtherRole'
                ]);
        });

        $this->actingAs($user)
            ->getJson(route('GetManagers') . '?page=1')
            ->assertStatus(200)
            ->assertJson([
                'msg' => 'Invalid user or role'
            ]);
    }
    public function test_it_returns_client_esoft_not_found_when_client_record_does_not_exist()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();


        $this->mock(AccountService::class, function ($mock) {
            $mock->shouldReceive('getRoleById')
                ->andReturn((object)[
                    'role_name' => RoleEnumString::ClientEsoft->value
                ]);
        });

        $this->actingAs($user)
            ->getJson(route('GetManagers'))
            ->assertStatus(200)
            ->assertJson([
                'msg' => 'Client Esoft not found'
            ]);
    }
    public function test_it_returns_paginated_managers_successfully()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();


        $client = ClientEsoft::factory()->create([
            'user_id' => $user->id
        ]);

        // Create Manager + User
        $managerUser = User::factory()->create([
            'name' => 'Manager One'
        ]);

        Manager::factory()->create([
            'client_esoft_id' => $client->id,
            'user_id' => $managerUser->id
        ]);

        $this->mock(AccountService::class, function ($mock) {
            $mock->shouldReceive('getRoleById')
                ->andReturn((object)[
                    'role_name' => RoleEnumString::ClientEsoft->value
                ]);
        });

        $this->actingAs($user)
            ->getJson(route('GetManagers') . '?page=1')->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Manager One'
            ])
            ->assertJsonStructure([
                'data',
                'links',
            ]);
    }
    public function test_it_fails_validation_when_email_is_missing()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        $this->actingAs($user);

        $this->postJson(route("CreateManager"), [
            'name' => 'Test Manager'
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }
    public function test_creating_manager_it_returns_user_not_found_when_client_esoft_does_not_exist()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        $this->actingAs($user);

        $this->mock(AccountService::class, function ($mock) {
            $mock->shouldReceive('getRoleByName')
                ->andReturn((object)['id' => 5]);
        });

        $this->postJson(route("CreateManager"), [
            'name' => 'Manager',
            'email' => fake()->unique()->safeEmail()
        ])
            ->assertStatus(200)
            ->assertJson([
                'msg' => 'user not found'
            ]);
    }
    public function test_it_creates_manager_successfully()
    {
        Notification::fake();

        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $this->actingAs($user);

        $client = ClientEsoft::factory()->create([
            'user_id' => $user->id
        ]);

        $this->mock(AccountService::class, function ($mock) {
            $mock->shouldReceive('getRoleByName')
                ->andReturn((object)['id' => 10]);
        });

        $payload = [
            'name' => 'New Manager',
            'email' => fake()->unique()->safeEmail()
        ];

        $response = $this->postJson(route("CreateManager"), $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'client_esoft_id',
                'user_id'
            ]);

        $this->assertDatabaseHas('users', [
            'email' => $payload['email'],
            'is_valid' => false
        ]);

        Notification::assertSentTo(
            User::where('email', $payload['email'])->first(),
            NotifyManagerCreationAccount::class
        );
    }
    public function test_it_blocks_unauthenticated_users()
    {
        $this->postJson(route("updateManager"), [])
            ->assertStatus(401);
    }
    public function test_it_fails_validation_when_required_fields_are_missing()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $this->actingAs($user);

        $this->postJson(route("updateManager"), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'manager_id']);
    }
    public function test_it_returns_404_when_manager_does_not_exist()
    {

        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $this->actingAs($user);

        $this->postJson(route("updateManager"), [
            'name' => 'Test',
            'email' => 'test@example.com',
            'manager_id' => 999
        ])
            ->assertStatus(404)
            ->assertJson([
                'msg' => 'Manager not found'
            ]);
    }
    public function test_it_updates_manager_successfully()
    {
        Notification::fake();

        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $this->actingAs($user);
        $old_email = fake()->unique()->safeEmail();
        $managerUser = User::factory()->create([
            'name' => 'Old Name',
            'email' => $old_email
        ]);

        $manager = Manager::factory()->create([
            'user_id' => $managerUser->id
        ]);
        $email = fake()->unique()->safeEmail();
        $payload = [
            'name' => 'New Name',
            'email' => $email,
            'manager_id' => $manager->id
        ];

        $response = $this->postJson(route("updateManager"), $payload);

        $response->assertStatus(200)
            ->assertJson([
                'status' => true,
                'message' => 'Manager updated successfully'
            ])
            ->assertJsonPath('data.user.name', 'New Name')
            ->assertJsonPath('data.user.email', $email);

        $this->assertDatabaseHas('users', [
            'id'    => $managerUser->id,
            'name'  => 'New Name',
            'email' => $email
        ]);

        Notification::assertSentTo(
            $managerUser,
            NotifyManagerCreationAccount::class
        );
    }
    public function test_when_notifying_managerit_fails_validation_when_email_is_missing()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $this->actingAs($user);


        $this->postJson(route("ReNotifyManager"), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }
    public function test_it_returns_user_not_found_if_email_does_not_exist()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $this->actingAs($user);
        $this->postJson(route("ReNotifyManager"), [
            'email' => 'notfound@example.com'
        ])
            ->assertStatus(200)
            ->assertJson([
                'msg' => 'user not found'
            ]);
    }
    public function it_sends_notification_successfully()
    {
        Notification::fake();

        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create([
            'email' => 'test@example.com'
        ]);

        $this->actingAs($user);

        $this->postJson(route("ReNotifyManager"), [
            'email' => 'test@example.com'
        ])
            ->assertStatus(200);

        Notification::assertSentTo(
            $user,
            NotifyManagerCreationAccount::class
        );
    }
    public function test_when_getting_manager_profile_datait_fails_validation_when_required_fields_are_missing()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $this->actingAs($user);

        $this->postJson(route("GetManagerProfileData"), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'manager_id',
                'month',
                'year'
            ]);
    }
    public function test_it_returns_404_when_manager_user_not_found()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $this->actingAs($user);

        $this->postJson(route("GetManagerProfileData"), [
            'manager_id' => 999,
            'month' => '01',
            'year' => 2025
        ])
            ->assertStatus(404)
            ->assertJson([
                'msg' => 'user not found'
            ]);
    }
    public function it_returns_404_when_client_esoft_not_found()
    {
        $managerUser = User::factory()->withRole(role_name: RoleEnumString::Manager->value)->create();
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $this->actingAs($user);

        $this->postJson(route("GetManagerProfileData"), [
            'manager_id' => $managerUser->id,
            'month' => '01',
            'year' => 2025
        ])
            ->assertStatus(404)
            ->assertJson([
                'message' => 'User not found'
            ]);
    }

    public function test_it_returns_404_when_manager_record_not_found()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $this->actingAs($user);

        $managerUser = User::factory()->withRole(role_name: RoleEnumString::Manager->value)->create();

        $client = ClientEsoft::factory()->create([
            'user_id' => $user->id
        ]);

        // Create Manager ownership relation ONLY
        Manager::factory()->create([
            'client_esoft_id' => $client->id,
            'user_id' => $managerUser->id
        ]);

        // Remove the real manager row after ownership passes
        Manager::where('user_id', $managerUser->id)->delete();

        $this->postJson(route("GetManagerProfileData"), [
            'manager_id' => $managerUser->id,
            'month' => '01',
            'year' => 2025
        ])
            ->assertStatus(404)
            ->assertJson([
                'msg' => 'user not found'
            ]);
    }

    public function test_it_returns_manager_profile_successfully()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $this->actingAs($user);

        $managerUser = User::factory()->create();

        $client = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        $manager = Manager::factory()->create([
            'user_id' => $managerUser->id,
            'client_esoft_id' => $client->id
        ]);

        $this->mock(AccountService::class, function ($mock) {
            $mock->shouldReceive('CheckAccountOwnerShipFromClientEsoftToManager')
                ->andReturn(true);
        });

        // Mock service layer static methods
        $this->mock(UserClientEsoftService::class, function ($mock) {
            $mock->shouldReceive('GetProjectsOfManager')->andReturn([]);
            $mock->shouldReceive('GetConsultantsOfManager')->andReturn([]);
            $mock->shouldReceive('GetCraOfManager')->andReturn([]);
            $mock->shouldReceive('GetAbsenceRequestOfManager')->andReturn([]);
        });

        $this->postJson(route("GetManagerProfileData"), [
            'manager_id' => $managerUser->id,
            'month' => '01',
            'year' => 2025
        ])
            ->assertStatus(200)
            ->assertJsonStructure([
                'projects',
                'consultants',
                'cra',
                'absences',
                'user'
            ]);
    }
    public function test_it_returns_404_when_manager_does_not_exist_when_deleting()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $this->actingAs($user);

        $this->postJson(route("deleteManager", ["id" => 999]))
            ->assertStatus(404);
    }
    public function test_it_returns_403_when_manager_does_not_belong_to_user_client()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $this->actingAs($user);

        $otherUser = User::factory()->create();

        $otherClient = ClientEsoft::factory()->create([
            'user_id' => $otherUser->id
        ]);

        $managerUser = User::factory()->create();

        $manager = Manager::factory()->create([
            'user_id' => $managerUser->id,
        ]);

        ClientEsoft::factory()->create([
            'user_id' => $user->id
        ]);

        $this->postJson(route("deleteManager", ["id" => $managerUser->id]))
            ->assertStatus(403)
            ->assertJson([
                'error' => 'Unauthorized'
            ]);
    }
    public function test_it_deletes_manager_and_related_projects_successfully()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $this->actingAs($user);

        $client = ClientEsoft::factory()->create([
            'user_id' => $user->id
        ]);

        $managerUser = User::factory()->create();

        $manager = Manager::factory()->create([
            'user_id' => $managerUser->id,
            'client_esoft_id' => $client->id
        ]);

        Project::factory()->create([
            'manager_id' => $manager->id
        ]);

        $response = $this->postJson(route("deleteManager", ["id" => $managerUser->id]));

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Manager deleted successfully'
            ]);

        $this->assertDatabaseMissing('managers', [
            'id' => $manager->id
        ]);

        $this->assertDatabaseMissing('projects', [
            'manager_id' => $manager->id
        ]);
    }
    public function test_it_returns_401_if_user_is_not_manager()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        $this->actingAs($user);

        // Act
        $response = $this->getJson(route('GetConcultantsOfManager'));

        // Assert
        $response->assertStatus(401);
    }
    public function test_it_returns_consultants_for_authenticated_manager()
    {
        // Arrange
        $user = User::factory()
            ->withRole(role_name: RoleEnumString::Manager->value)
            ->create();

        $manager = Manager::factory()->create([
            'user_id' => $user->id,
        ]);

        $consultants = Consultant::factory()->count(3)->create();

        // Attach consultants to the manager via pivot
        $manager->consultants()->attach($consultants->pluck('id')->toArray());

        $this->actingAs($user);

        // Act
        $response = $this->getJson(route('GetConcultantsOfManager'));

        // Assert
        $response->assertStatus(200);
        $response->assertJsonCount(3);
    }
    public function test_re_notify_manager_sends_notification_successfully()
    {
        Notification::fake();

        $user = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create([
                'email' => 'manager@test.com',
            ]);

        $this->actingAs($user);

        $response = $this->postJson(route('ReNotifyManager'), [
            'email' => 'manager@test.com',
        ]);

        $response
            ->assertStatus(200)
            ->assertExactJson([]);

        Notification::assertSentTo(
            $user,
            NotifyManagerCreationAccount::class
        );
    }
    public function test_re_notify_manager_generates_12_char_password()
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'manager@test.com',
        ]);

        $this->actingAs($user);

        $this->postJson(route('ReNotifyManager'), [
            'email' => 'manager@test.com',
        ]);

        Notification::assertSentTo(
            $user,
            NotifyManagerCreationAccount::class,
            function ($notification) {
                return strlen($notification->password) === 12;
            }
        );
    }
    public function test_re_notify_manager_sends_only_one_notification()
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'manager@test.com',
        ]);

        $this->actingAs($user);

        $this->postJson(route('ReNotifyManager'), [
            'email' => 'manager@test.com',
        ]);

        Notification::assertSentToTimes(
            $user,
            NotifyManagerCreationAccount::class,
            1
        );
    }
    public function test_delete_manager_returns_404_if_manager_not_found()
    {
        // Create a user with ClientEsoft role
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Authenticate as this user
        $this->actingAs($user);

        // Call the deleteManager route with a non-existing manager ID
        $response = $this->postJson(route('deleteManager', ['id' => 999]));

        // Assert it returns 404 with the expected JSON error
        $response->assertStatus(404)
            ->assertJson([
                'error' => 'Manager not found',
            ]);
    }
    public function test_create_manager_returns_user_not_found_when_client_esoft_missing()
    {
        // Create a user with ClientEsoft role
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Authenticate as this user
        $this->actingAs($user);

        // Prepare payload for creating a manager
        $payload = [
            'name' => 'Test Manager',
            'email' => fake()->unique()->safeEmail(),
        ];

        // Call the CreateManager route
        $response = $this->postJson(route('CreateManager'), $payload);

        // Assert it returns the expected JSON error
        $response->assertStatus(200)
            ->assertJson(ExceptionMessagesService::errorUserNotFound());
    }
    public function test_get_managers_non_paginated_returns_invalid_user_or_role()
    {
        // Create a user with a role that is not ClientEsoft
        $user = User::factory()->withRole(role_name: RoleEnumString::Manager->value)->create();

        $this->mock(AccountService::class, function ($mock) {
            $mock->shouldReceive('getRoleById')
                ->andReturn((object)[
                    'role_name' => RoleEnumString::Manager->value
                ]);
        });

        $this->actingAs($user);

        $response = $this->getJson(route('getManagersNonPaginated'));

        $response->assertStatus(200)
            ->assertJson(['msg' => 'Invalid user or role']);
    }

    public function test_get_managers_non_paginated_returns_client_esoft_not_found()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        $this->mock(AccountService::class, function ($mock) {
            $mock->shouldReceive('getRoleById')
                ->andReturn((object)[
                    'role_name' => RoleEnumString::ClientEsoft->value
                ]);
        });

        $this->actingAs($user);

        $response = $this->getJson(route('getManagersNonPaginated'));

        $response->assertStatus(200)
            ->assertJson(['msg' => 'Client Esoft not found']);
    }

    public function test_get_managers_non_paginated_returns_managers_successfully()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        $client = ClientEsoft::factory()->create([
            'user_id' => $user->id
        ]);

        // Create some managers with users
        $managerUser1 = User::factory()->create(['name' => 'Manager One']);
        $managerUser2 = User::factory()->create(['name' => 'Manager Two']);

        Manager::factory()->create([
            'user_id' => $managerUser1->id,
            'client_esoft_id' => $client->id
        ]);

        Manager::factory()->create([
            'user_id' => $managerUser2->id,
            'client_esoft_id' => $client->id
        ]);

        $this->mock(AccountService::class, function ($mock) {
            $mock->shouldReceive('getRoleById')
                ->andReturn((object)[
                    'role_name' => RoleEnumString::ClientEsoft->value
                ]);
        });

        $this->actingAs($user);

        $response = $this->getJson(route('getManagersNonPaginated'));

        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonFragment(['name' => 'Manager One'])
            ->assertJsonFragment(['name' => 'Manager Two']);
    }
    public function test_get_manager_profile_data_returns_client_esoft_not_found()
    {
        // Create a user with ClientEsoft role
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Acting as this user
        $this->actingAs($user);

        // Create a manager user to pass validation
        $managerUser = User::factory()->create();

        // We deliberately do NOT create a ClientEsoft record for the authenticated user
        // so the code should hit the "user_client_esoft not found" branch

        $payload = [
            'manager_id' => $managerUser->id,
            'month' => '01',
            'year' => 2025,
        ];

        $response = $this->postJson(route('GetManagerProfileData'), $payload);

        $response->assertStatus(404)
            ->assertJson([
                'msg' => 'user not found'
            ]);
    }
}
