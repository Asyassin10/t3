<?php

namespace Tests\Feature;

use App\Enums\AbsenceRequestStatusEnum;
use App\Enums\RoleEnumString;
use App\Models\AbsenceRequest;
use App\Models\AbsenceRequestType;
use App\Models\ClientEsoft;
use App\Models\Consultant;
use App\Models\CRA;
use App\Models\Manager;
use App\Models\Project;
use App\Models\User;
use App\Services\AccountService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class AbsenceControllerTest extends TestCase
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

    // ---------------------------------------------------------------- CreateAbsenceRequest ----------------------------------------------------------------
    public function test_create_absence_request_with_valid_data()
    {
        // Create a user
        $user = User::factory()->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Simulate authentication
        $this->actingAs($user);

        $data = [
            'reason' => 'Family emergency',
            'absence_request_type_id' => 1,
            'date_debut' => '2024-12-01',
            'date_fin' => '2024-12-05',
        ];
        $response = $this->postJson('/api/absence/create_absence_request', $data);

        $response->assertStatus(201);
        $this->assertDatabaseHas(table: 'absence_requests', data: [
            'reason' => $data['reason'],
            'type_absence_id' => $data['absence_request_type_id'],
            'date_debut' => $data['date_debut'],
            'date_fin' => $data['date_fin'],
            'nombre_des_jours' => 4,
            'user_id' => $user->id,
        ]);
    }
    public function test_create_absence_request_without_dates_fails()
    {
        // Create a user
        $user = User::factory()->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Simulate authentication
        $this->actingAs($user);
        $data = [
            'reason' => 'Family emergency',
            'absence_request_type_id' => 1,
        ];

        $response = $this->postJson('/api/absence/create_absence_request', $data);

        $response->assertStatus(422); // Validation error
    }
    public function test_create_absence_request_with_invalid_date_format()
    {
        $data = [
            'reason' => 'Family emergency',
            'absence_request_type_id' => 1,
            'date_debut' => '12?page=11/2024', // Invalid format
            'date_fin' => '12?page=15/2024',
        ];
        // Create a user
        $user = User::factory()->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Simulate authentication
        $this->actingAs($user);
        $response = $this->postJson('/api/absence/create_absence_request', $data);

        $response->assertStatus(422); // Validation error
    }
    public function test_manager_can_get_absences_for_their_consultants_and_self()
    {
        // 1. Create manager user
        $managerUser = User::factory()->withRole(role_name: RoleEnumString::Manager->value)->create();

        // 2. Create manager record
        $manager = Manager::factory()->create([
            'user_id' => $managerUser->id,
        ]);

        // 3. Create consultants and attach to manager
        $consultants = User::factory()->count(2)->create();
        foreach ($consultants as $consultantUser) {
            $consultant = Consultant::factory()->create(['user_id' => $consultantUser->id]);
            $manager->consultants()->attach($consultant->id);
        }

        // 4. Create absence requests for manager and consultants
        AbsenceRequest::factory()->create([
            'user_id' => $managerUser->id,
        ]);

        foreach ($consultants as $consultantUser) {
            AbsenceRequest::factory()->create([
                'user_id' => $consultantUser->id,
            ]);
        }

        // 5. Act as manager user
        $this->actingAs($managerUser);

        // 6. Call the API without UserId
        $response = $this->getJson('/api/absence/get_absence_of_user');

        // 7. Assertions
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertCount(3, $data); // Manager + 2 consultants
    }

    public function test_create_absence_request_with_date_fin_before_date_debut()
    {
        $data = [
            'reason' => 'Family emergency',
            'absence_request_type_id' => 1,
            'date_debut' => '2024-12-05',
            'date_fin' => '2024-12-01', // Invalid order
        ];
        // Create a user
        $user = User::factory()->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Simulate authentication
        $this->actingAs($user);
        $response = $this->postJson(uri: '/api/absence/create_absence_request', data: $data);

        $response->assertStatus(422); // Validation error
    }

    // ---------------------------------------------------------------- GetAbsenceOfMe ----------------------------------------------------------------



    public function test_it_returns_validation_error_when_query_is_invalid()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Pass an invalid query parameter to trigger validator failure
        $response = $this->getJson('/api/absence/get_absence_of_user?page=abc');

        $response->assertStatus(422)
            ->assertJsonStructure(['errors']);
    }
    public function test_role_client_esoft_with_absences()
    {

        // Create a user
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);

        // Simulate authentication
        $this->actingAs($user);

        $manager = Manager::factory()->create(['client_esoft_id' => $clientEsoft->id]);
        $consultant = Consultant::factory()->create(['client_esoft_id' => $clientEsoft->id]);

        $managerAbsence = AbsenceRequest::factory()->create(['user_id' => $manager->user_id]);
        $consultantAbsence = AbsenceRequest::factory()->create(['user_id' => $consultant->user_id]);
        $userAbsence = AbsenceRequest::factory()->create(['user_id' => $user->id]);

        $response = $this->getJson(uri: '/api/absence/get_absence_of_user?page=1');
        $data_log = [
            'managerAbsence_id' => $managerAbsence->id,
            'consultantAbsence_id' => $consultantAbsence->id,
            'userAbsence_id' => $userAbsence->id,
        ];
        Log::info(json_encode($data_log));
        $response->assertStatus(200)
            ->assertJsonFragment(data: ['id' => $managerAbsence->id])
            ->assertJsonFragment(data: ['id' => $consultantAbsence->id])
            ->assertJsonFragment(data: ['id' => $userAbsence->id]);
    }



    public function test_it_filters_by_userid_when_filled_and_not_consultant()
    {
        $managerUser = User::factory()->withRole(RoleEnumString::Manager->value)->create();
        $manager = Manager::factory()->create(['user_id' => $managerUser->id]);

        $anotherUser = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();
        AbsenceRequest::factory()->create(['user_id' => $anotherUser->id]);

        $this->actingAs($managerUser);

        $response = $this->getJson('/api/absence/get_absence_of_user?UserId=' . $anotherUser->id);

        $response->assertStatus(200)
            ->assertJsonFragment(['user_id' => $anotherUser->id])
            ->assertJsonMissing(['user_id' => $managerUser->id]);
    }






    public function test_it_filters_absences_for_consultant()
    {
        $user = User::factory()->withRole(RoleEnumString::Consultant->value)->create();
        $consultant = Consultant::factory()->create(['user_id' => $user->id]);
        AbsenceRequest::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user);

        $response = $this->getJson('/api/absence/get_absence_of_user');

        $response->assertStatus(200)
            ->assertJsonFragment(['user_id' => $user->id]);
    }
    public function test_role_manager_with_absences()
    {
        // Create a user
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user_client_esoft->id,
        ]);

        // Simulate authentication
        $this->actingAs($user_client_esoft);

        $manager = Manager::factory()->create(['client_esoft_id' => $clientEsoft->id]);
        $consultant = Consultant::factory()->create(['client_esoft_id' => $clientEsoft->id]);

        $managerAbsence = AbsenceRequest::factory()->create(['user_id' => $manager->user_id]);
        $consultantAbsence = AbsenceRequest::factory()->create(['user_id' => $consultant->user_id]);

        $response = $this->getJson(uri: '/api/absence/get_absence_of_user?page=1');
        $response->assertStatus(200)
            ->assertJsonFragment(data: ['id' => $managerAbsence->id])
            ->assertJsonFragment(data: ['id' => $consultantAbsence->id]);
    }

    public function test_role_concultant_with_absences()
    {
        // Create a user
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user_client_esoft->id,
        ]);

        // Simulate authentication
        $this->actingAs($user_client_esoft);

        $consultant = Consultant::factory()->create(['client_esoft_id' => $clientEsoft->id]);

        $consultantAbsence = AbsenceRequest::factory()->create(['user_id' => $consultant->user_id]);

        $response = $this->getJson(uri: '/api/absence/get_absence_of_user?page=1');
        $response->assertStatus(200)
            ->assertJsonFragment(data: ['id' => $consultantAbsence->id]);
    }
    public function test_get_list_of_absence_types()
    {
        // Create a user
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user_client_esoft->id,
        ]);

        // Simulate authentication
        $this->actingAs($user_client_esoft);

        AbsenceRequestType::factory()->count(3)->create();

        // Act: Call the method
        $response = $this->getJson(uri: '/api/absence/get_absence_types');

        // Assert: Verify the response
        $response->assertStatus(200)
            ->assertJsonCount(count: 4)
            ->assertJsonStructure([
                '*' => ['id', 'label_type_absence', 'created_at', 'updated_at'],
            ]);
    }
    // ---------------------------------------------------------------- GetAbsenceOfDateMonthAndYear ----------------------------------------------------------------

    public function test_get_absence_with_invalid_input()
    {

        // Create a user
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user_client_esoft->id,
        ]);

        // Simulate authentication
        $this->actingAs($user_client_esoft);
        $response = $this->postJson(uri: '/api/absence/get_absence_of_date_month_and_year', data: []); // Replace with the correct route

        $response->assertStatus(422) // Validation error
            ->assertJsonValidationErrors(['year', 'month', 'id']);
    }
    public function test_get_absence_when_cra_not_found()
    {
        // Create a user
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user_client_esoft->id,
        ]);

        // Simulate authentication
        $this->actingAs($user_client_esoft);
        $response = $this->postJson(uri: '/api/absence/get_absence_of_date_month_and_year', data: [
            'year' => 2024,
            'month' => 12,
            'id' => 999, // Non-existent CRA ID
        ]);

        $response->assertStatus(200)
            ->assertJson(['msg' => 'not found']);
    }
    public function test_get_absence_with_valid_data()
    {
        // Arrange: Create a user and a CRA linked to the user
        // Create a user
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user_client_esoft->id,
        ]);

        // Simulate authentication
        $this->actingAs($user_client_esoft);
        $cra = CRA::factory()->create([
            'user_id' => $user_client_esoft->id,
            'status' => 'approved', // Example field value, adjust as needed
        ]);

        // Create an AbsenceRequestType and AbsenceRequest linked to the user
        $absenceType = AbsenceRequestType::factory()->create();
        $absence = AbsenceRequest::factory()->create([
            'date_debut' => '2024-12-01',
            'user_id' => $user_client_esoft->id,
            'type_absence_id' => $absenceType->id,
        ]);

        // Act: Call the endpoint
        $response = $this->postJson('/api/absence/get_absence_of_date_month_and_year', [
            'year' => 2024,
            'month' => 12,
            'id' => $cra->id,
        ]);

        // Assert: Validate the response
        $response->assertStatus(200)
            ->assertJsonCount(1) // One absence request
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'date_debut',
                    'user_id',
                    'type_absence_id',
                    'type_absence' => ['id', 'label_type_absence'],
                    'user' => ['id', 'name', 'email'], // Adjust fields as per User model
                ],
            ]);
    }
    // ------------------- GetAllAbsenceStatus
    public function test_get_all_absence_status()
    {

        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user_client_esoft->id,
        ]);

        // Simulate authentication
        $this->actingAs($user_client_esoft);
        // Arrange
        $expectedStatus = AbsenceRequestStatusEnum::values();

        // Act
        $response = $this->getJson('/api/absence/get_all_absence_status'); // Replace with the correct route

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'status' => $expectedStatus,
            ]);
    }

    // updateAbsence

    public function test_it_updates_the_absence_status()
    {

        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user_client_esoft->id,
        ]);

        // Simulate authentication
        $this->actingAs(user: $user_client_esoft);
        $absence = AbsenceRequest::factory()->create([
            "user_id" => $user_client_esoft->id,
        ]);

        $response = $this->json(method: 'POST', uri: "/api/absence/update_absence", data: [
            'id' => $absence->id,
            'status' => AbsenceRequestStatusEnum::VALID->value,
        ]);

        $response->assertStatus(200);
        $absence->refresh();
        $this->assertEquals(expected: AbsenceRequestStatusEnum::VALID->value, actual: $absence->status);
    }

    public function test_it_returns_not_found_when_absence_does_not_exist()
    {

        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user_client_esoft->id,
        ]);

        // Simulate authentication
        $this->actingAs(user: $user_client_esoft);

        $response = $this->json(method: 'POST', uri: "/api/absence/update_absence", data: [
            'id' => 999,
            'status' => AbsenceRequestStatusEnum::VALID->value,
        ]);

        $response->assertStatus(404);
        $response->assertJson([
            'message' => 'not found',
        ]);
    }
    public function test_it_validates_the_id_is_numeric()
    {
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user_client_esoft->id,
        ]);

        // Simulate authentication
        $this->actingAs(user: $user_client_esoft);
        $response = $this->json(method: 'POST', uri: "/api/absence/update_absence", data: [
            'id' => "abs",
            'status' => AbsenceRequestStatusEnum::VALID->value,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['id']);
    }
    public function test_it_validates_the_status_is_enum()
    {
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user_client_esoft->id,
        ]);

        // Simulate authentication
        $this->actingAs(user: $user_client_esoft);
        $response = $this->json(method: 'POST', uri: "/api/absence/update_absence", data: [
            'id' => 1,
            'status' => 'invalid_status',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['status']);
    }

    public function test_it_validates_missing_parameters()
    {
        $user_client_esoft = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();

        // Simulate the ClientEsoft model for the user
        ClientEsoft::factory()->create([
            'user_id' => $user_client_esoft->id,
        ]);

        // Simulate authentication
        $this->actingAs(user: $user_client_esoft);
        $response = $this->json(method: 'POST', uri: "/api/absence/update_absence", data: [
            'id' => 1,
        ]);

        $response->assertStatus(status: 422);
        $response->assertJsonValidationErrors(errors: ['status']);
    }
}
