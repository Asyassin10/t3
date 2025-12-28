<?php

namespace Tests\Feature;

use App\Enums\CraStatusEnum;
use App\Enums\RoleEnumString;
use App\Models\Activite;
use App\Models\ClientEsoft;
use App\Models\Consultant;
use App\Models\CRA;
use App\Models\Manager;
use App\Models\Project;
use App\Models\TimeSheet;
use App\Models\TimeSheetLigne;
use App\Models\User;
use App\Services\ExceptionMessagesService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TimeTrackingControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Run the artisan command before each test
        $this->artisan(command: 'init-database')->run();

        // Create authenticated ClientEsoft user
        $this->user = User::factory()
            ->withRole(RoleEnumString::ClientEsoft->value)
            ->create();

        ClientEsoft::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $this->actingAs($this->user);
    }
    public function test_it_creates_a_time_sheet_and_lines_successfully()
    {
        Carbon::setTestNow(now());

        $project = Project::factory()->create();
        $activite = Activite::factory()->create();

        // CRA for current month (REQUIRED)
        $cra = CRA::factory()->create([
            'user_id' => $this->user->id,
            'created_at' => now(),
        ]);

        $payload = [
            'project_id' => $project->id,
            'activite_id' => $activite->id,
            'ids_of_days' => [1, 2, 3],
            'count_of_days' => 3,
            'ligne_date' => now()->format('Y-m-d'),
            'times' => [
                [
                    'value' => '8',
                    'is_week_end' => false,
                    'is_disabled' => false,
                    'rest_acceptable' => 1,
                    'app_id' => 1,
                ],
                [
                    'value' => '6',
                    'is_week_end' => false,
                    'is_disabled' => false,
                    'rest_acceptable' => 1,
                    'app_id' => 2,
                ],
            ],
        ];

        $response = $this->postJson(
            '/api/time_sheet/create_sheet_ligne',
            $payload
        );

        $response->assertStatus(200)
            ->assertJsonFragment([
                'project_id' => $project->id,
                'activite_id' => $activite->id,
                'user_id' => $this->user->id,
            ]);

        // TimeSheet created
        $this->assertDatabaseHas('time_sheets', [
            'project_id' => $project->id,
            'activite_id' => $activite->id,
            'cra_id' => $cra->id,
            'count_of_days' => 3,
        ]);

        $timeSheet = TimeSheet::first();

        // TimeSheetLigne created
        $this->assertDatabaseCount('time_sheet_lignes', 2);

        $this->assertDatabaseHas('time_sheet_lignes', [
            'time_sheet_id' => $timeSheet->id,
            'value' => '8',
            'app_id' => 1,
        ]);
    }
    public function test_when_creating_time_sheet_it_fails_validation_when_required_fields_are_missing()
    {
        $response = $this->postJson(
            '/api/time_sheet/create_sheet_ligne',
            []
        );

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'project_id',
                'activite_id',
                'ids_of_days',
                'count_of_days',
                'ligne_date',
                'times',
            ]);
    }
    public function it_fails_validation_when_times_structure_is_invalid()
    {
        $project = Project::factory()->create();
        $activite = Activite::factory()->create();

        CRA::factory()->create([
            'user_id' => $this->user->id,
            'created_at' => now(),
        ]);

        $payload = [
            'project_id' => $project->id,
            'activite_id' => $activite->id,
            'ids_of_days' => [1],
            'count_of_days' => 1,
            'ligne_date' => now()->format('Y-m-d'),
            'times' => [
                [
                    'value' => '8',
                    // missing required fields
                ],
            ],
        ];

        $response = $this->postJson(
            '/api/time_sheet/create_sheet_ligne',
            $payload
        );

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'times.0.is_week_end',
                'times.0.is_disabled',
                'times.0.rest_acceptable',
                'times.0.app_id',
            ]);
    }
    /** @test */
    public function test_it_deletes_time_sheet_and_its_lignes_successfully()
    {
        // Create TimeSheet
        $timeSheet = TimeSheet::factory()->create([
            'user_id' => $this->user->id,
        ]);

        // Create related lignes
        TimeSheetLigne::factory()->count(2)->create([
            'time_sheet_id' => $timeSheet->id,
        ]);

        $response = $this->deleteJson(
            route('DeleteTimeLigne'),
            ['time_ligne_id' => $timeSheet->id]
        );

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Time sheet deleted successfully'
            ]);

        // Ensure time sheet is deleted
        $this->assertDatabaseMissing('time_sheets', [
            'id' => $timeSheet->id,
        ]);

        // Ensure lignes are deleted
        $this->assertDatabaseCount('time_sheet_lignes', 0);
    }
    /** @test */
    public function test_it_returns_404_if_time_sheet_does_not_exist()
    {
        $response = $this->deleteJson(
            route('DeleteTimeLigne'),
            ['time_ligne_id' => 99999]
        );

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'Time sheet not found'
            ]);
    }
    /** @test */
    public function test_it_fails_validation_when_time_ligne_id_is_missing()
    {
        $response = $this->deleteJson(
            route('DeleteTimeLigne'),
            []
        );

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'time_ligne_id'
            ]);
    }
    /** @test */
    public function test_it_returns_time_sheets_of_user_based_on_year_and_month()
    {
        Carbon::setTestNow('2025-01-15');

        // CRA for user
        $cra = CRA::factory()->create([
            'user_id' => $this->user->id,
        ]);

        // Matching time sheet
        $matchingTimeSheet = TimeSheet::factory()->create([
            'user_id' => $this->user->id,
            'cra_id' => $cra->id,
            'date' => '2025-01-10',
        ]);

        // Non-matching (different month)
        TimeSheet::factory()->create([
            'user_id' => $this->user->id,
            'cra_id' => $cra->id,
            'date' => '2025-02-10',
        ]);

        $payload = [
            'year' => 2025,
            'month' => 1,
            'id' => $cra->id,
        ];

        $response = $this->postJson(
            route('getTimeSheetOfUserBasedOnDate'),
            $payload
        );

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'id' => $matchingTimeSheet->id,
            ]);
    }
    /** @test */
    public function test_it_returns_empty_array_when_no_time_sheets_match_date()
    {
        $cra = CRA::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $payload = [
            'year' => 2024,
            'month' => 12,
            'id' => $cra->id,
        ];

        $response = $this->postJson(
            route('getTimeSheetOfUserBasedOnDate'),
            $payload
        );

        $response->assertStatus(200)
            ->assertExactJson([]);
    }
    /** @test */
    public function test_it_returns_not_found_when_cra_does_not_exist()
    {
        $payload = [
            'year' => 2025,
            'month' => 1,
            'id' => 999999,
        ];

        $response = $this->postJson(
            route('getTimeSheetOfUserBasedOnDate'),
            $payload
        );

        $response->assertStatus(200)
            ->assertJson([
                'msg' => 'not found',
            ]);
    }
    /** @test */
    public function test_it_fails_validation_when_required_fields_are_missing()
    {
        $response = $this->postJson(
            route('getTimeSheetOfUserBasedOnDate'),
            []
        );

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'year',
                'month',
                'id',
            ]);
    }
    /** @test */
    public function it_initializes_cra_for_authenticated_user()
    {
        $response = $this->postJson(route('initCra'));

        $response->assertStatus(200)
            ->assertJsonFragment([
                'user_id' => $this->user->id,
                'status' => CraStatusEnum::NOT_SENT_TO_VALIDATION_YET->value,
                'number_of_days_filled' => 0,
                'progress' => 0,
            ]);

        $this->assertDatabaseHas('c_r_a_s', [ // adjust table name if needed
            'user_id' => $this->user->id,
            'status' => CraStatusEnum::NOT_SENT_TO_VALIDATION_YET->value,
        ]);
    }
    /** @test */
    public function test_it_creates_multiple_cras_if_called_multiple_times()
    {
        $this->postJson(route('initCra'));
        $this->postJson(route('initCra'));

        $this->assertDatabaseCount('c_r_a_s', 2);
    }
    /** @test */
    public function test_it_returns_validation_errors_for_invalid_query_params()
    {
        $response = $this->getJson(route('getCrasOfMe', [
            'page' => 0,
            'selectedMonth' => 13,
            'selectedYear' => 1999,
        ]));

        $response->assertStatus(422)
            ->assertJsonStructure([
                'errors' => [
                    'page',
                    'selectedMonth',
                    'selectedYear',
                ],
            ]);
    }
    /** @test */
    public function test_consultant_sees_only_his_own_cras()
    {
        Carbon::setTestNow('2025-01-15');

        $consultantUser = User::factory()
            ->withRole(RoleEnumString::Consultant->value)
            ->create();

        Consultant::factory()->create([
            'user_id' => $consultantUser->id,
        ]);

        $this->actingAs($consultantUser);

        // Own CRA
        CRA::factory()->create([
            'user_id' => $consultantUser->id,
            'created_at' => now(),
        ]);

        // Other user's CRA
        CRA::factory()->create();

        $response = $this->getJson(route('getCrasOfMe'));

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }
    /** @test */
    public function test_manager_sees_own_and_consultants_cras()
    {
        Carbon::setTestNow('2025-01-15');

        // Create manager user and manager
        $managerUser = User::factory()
            ->withRole(RoleEnumString::Manager->value)
            ->create();

        $manager = Manager::factory()->create([
            'user_id' => $managerUser->id,
        ]);

        $this->actingAs($managerUser);

        // Create consultant user and consultant
        $consultantUser = User::factory()->create();
        $consultantObject = Consultant::factory()->create([
            'user_id' => $consultantUser->id,
        ]);

        // Create project and attach manager and consultant
        $project = Project::factory()->create([
            'manager_id' => $manager->id,
        ]);

        $project->consultants()->attach($consultantObject->id, ['price_per_day' => 0]);
        $project->managers()->attach($manager->id, [
            "project_manager_price_per_day" => 22,
            'date_of_start' => now(),
            'date_of_end' => now()->addMonth(),
        ]);

        // Create CRAs for manager and consultant
        CRA::factory()->create(['user_id' => $managerUser->id]);
        CRA::factory()->create(['user_id' => $consultantUser->id]);

        // Call endpoint
        $response = $this->getJson(route('getCrasOfMe'));

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }
    /** @test */
    public function test_client_esoft_sees_own_managers_and_consultants_cras()
    {
        Carbon::setTestNow('2025-01-15');

        $clientUser = User::factory()
            ->withRole(RoleEnumString::ClientEsoft->value)
            ->create();

        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $clientUser->id,
        ]);

        $this->actingAs($clientUser);

        $managerUser = User::factory()->create();
        Manager::factory()->create([
            'user_id' => $managerUser->id,
            'client_esoft_id' => $clientEsoft->id,
        ]);

        $consultantUser = User::factory()->create();
        Consultant::factory()->create([
            'user_id' => $consultantUser->id,
            'client_esoft_id' => $clientEsoft->id,
        ]);

        CRA::factory()->create(['user_id' => $clientUser->id]);
        CRA::factory()->create(['user_id' => $managerUser->id]);
        CRA::factory()->create(['user_id' => $consultantUser->id]);

        $response = $this->getJson(route('getCrasOfMe'));

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }
    /** @test */
    public function test_it_filters_cras_by_selected_year_and_month()
    {
        Carbon::setTestNow('2025-01-10');

        CRA::factory()->create([
            'user_id' => $this->user->id,
            'created_at' => '2025-01-05',
        ]);

        CRA::factory()->create([
            'user_id' => $this->user->id,
            'created_at' => '2024-12-05',
        ]);

        $response = $this->getJson(route('getCrasOfMe', [
            'selectedYear' => 2025,
            'selectedMonth' => 1,
        ]));

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }
    /** @test */
    public function it_paginates_cras_correctly()
    {
        CRA::factory()->count(6)->create([
            'user_id' => $this->user->id,
        ]);

        $response = $this->getJson(route('getCrasOfMe', [
            'page' => 1,
        ]));

        $response->assertStatus(200)
            ->assertJsonCount(4, 'data');
    }
    /** @test */
    public function it_returns_404_if_manager_record_not_found()
    {
        $managerUser = User::factory()->withRole(RoleEnumString::Manager->value)->create();

        // Do NOT create Manager record
        $this->actingAs($managerUser);

        $response = $this->getJson(route('getCrasOfMe'));

        $response->assertStatus(404)
            ->assertExactJson(ExceptionMessagesService::errorUserNotFound());
    }
    /** @test */
    public function manager_can_filter_cras_by_selected_year()
    {
        Carbon::setTestNow('2025-01-10');

        $managerUser = User::factory()->withRole(RoleEnumString::Manager->value)->create();
        $manager = Manager::factory()->create(['user_id' => $managerUser->id]);
        $this->actingAs($managerUser);

        $consultantUser = User::factory()->create();
        $objectConsultant = Consultant::factory()->create(['user_id' => $consultantUser->id]);
        $project = Project::factory()->create(['manager_id' => $manager->id]);
        $project->consultants()->attach($objectConsultant->id, ['price_per_day' => 0]);

        // CRA in 2025
        CRA::factory()->create(['user_id' => $consultantUser->id, 'created_at' => '2025-01-05']);

        // CRA in 2024
        CRA::factory()->create(['user_id' => $consultantUser->id, 'created_at' => '2024-12-05']);

        $response = $this->getJson(route('getCrasOfMe', ['selectedYear' => 2025]));

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }
    /** @test */
    public function manager_can_filter_cras_by_selected_month()
    {
        Carbon::setTestNow('2025-01-10');

        $managerUser = User::factory()->withRole(RoleEnumString::Manager->value)->create();
        $manager = Manager::factory()->create(['user_id' => $managerUser->id]);
        $this->actingAs($managerUser);

        $consultantUser = User::factory()->create();
        $objectConsultant =  Consultant::factory()->create(['user_id' => $consultantUser->id]);
        $project = Project::factory()->create(['manager_id' => $manager->id]);
        $project->consultants()->attach($objectConsultant->id, ['price_per_day' => 0]);

        // CRA in January
        CRA::factory()->create(['user_id' => $consultantUser->id, 'created_at' => '2025-01-05']);

        // CRA in February
        CRA::factory()->create(['user_id' => $consultantUser->id, 'created_at' => '2025-02-05']);

        $response = $this->getJson(route('getCrasOfMe', ['selectedMonth' => 1]));

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }
    /** @test */
    public function it_returns_404_if_client_esoft_record_not_found()
    {
        $clientUser = User::factory()->withRole(RoleEnumString::ClientEsoft->value)->create();

        // Do NOT create ClientEsoft record
        $this->actingAs($clientUser);

        $response = $this->getJson(route('getCrasOfMe'));

        $response->assertStatus(404)
            ->assertExactJson(ExceptionMessagesService::errorUserNotFound());
    }
    /** @test */
    public function it_returns_404_if_consultant_record_not_found()
    {
        $consultantUser = User::factory()->withRole(RoleEnumString::Consultant->value)->create();

        // Do NOT create Consultant record
        $this->actingAs($consultantUser);

        $response = $this->getJson(route('getCrasOfMe'));

        $response->assertStatus(404)
            ->assertExactJson(ExceptionMessagesService::errorUserNotFound());
    }
    /** @test */
    public function consultant_can_filter_cras_by_selected_year_and_month()
    {
        Carbon::setTestNow('2025-01-10');

        $consultantUser = User::factory()->withRole(RoleEnumString::Consultant->value)->create();
        Consultant::factory()->create(['user_id' => $consultantUser->id]);
        $this->actingAs($consultantUser);

        // CRA in Jan 2025
        CRA::factory()->create(['user_id' => $consultantUser->id, 'created_at' => '2025-01-05']);

        // CRA in Feb 2025
        CRA::factory()->create(['user_id' => $consultantUser->id, 'created_at' => '2025-02-05']);

        // CRA in Jan 2024
        CRA::factory()->create(['user_id' => $consultantUser->id, 'created_at' => '2024-01-05']);

        $response = $this->getJson(route('getCrasOfMe', [
            'selectedYear' => 2025,
            'selectedMonth' => 1,
        ]));

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }
    /** @test */
    public function it_returns_validation_error_when_id_is_missing_or_invalid()
    {
        $this->actingAs($this->user);

        // Missing ID
        $response = $this->postJson(route('ValidateCra'), []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['id']);

        // Invalid ID (string)
        $response = $this->postJson(route('ValidateCra'), ['id' => 'abc']);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['id']);
    }
    /** @test */
    public function it_returns_not_found_if_cra_does_not_exist()
    {
        $this->actingAs($this->user);

        $response = $this->postJson(route('ValidateCra'), ['id' => 999]);

        $response->assertStatus(200) // controller currently returns 200 with 'msg'
            ->assertExactJson(['msg' => 'not found']);
    }
    /** @test */
    public function it_validates_cra_successfully()
    {
        $this->actingAs($this->user);

        $cra = CRA::factory()->create([
            'status' => CraStatusEnum::NOT_SENT_TO_VALIDATION_YET->value,
        ]);

        $response = $this->postJson(route('ValidateCra'), ['id' => $cra->id]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $cra->id,
                'status' => CraStatusEnum::VALIDATED->value,
            ]);

        $this->assertDatabaseHas('c_r_a_s', [
            'id' => $cra->id,
            'status' => CraStatusEnum::VALIDATED->value,
        ]);
    }
    /** @test */
    public function it_undoes_send_cra_to_validation_successfully()
    {
        Carbon::setTestNow('2025-01-15');

        $this->actingAs($this->user);

        $cra = CRA::factory()->create([
            'user_id' => $this->user->id,
            'status' => CraStatusEnum::VALIDATED->value,
            'created_at' => now(),
        ]);

        $response = $this->postJson(route('UndoSendCraToValidation'));

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $cra->id,
                'status' => CraStatusEnum::NOT_SENT_TO_VALIDATION_YET->value,
            ]);

        $this->assertDatabaseHas('c_r_a_s', [
            'id' => $cra->id,
            'status' => CraStatusEnum::NOT_SENT_TO_VALIDATION_YET->value,
        ]);
    }
    /** @test */
    public function it_fails_gracefully_if_no_cra_exists_for_current_month()
    {
        Carbon::setTestNow('2025-01-15');

        $this->actingAs($this->user);

        // No CRA created for current user
        $response = $this->postJson(route('UndoSendCraToValidation'));

        $response->assertStatus(500); // Controller will throw error if $cra is null
    }
    /** @test */
    public function it_sends_cra_to_validation_successfully()
    {
        Carbon::setTestNow('2025-01-15');

        $this->actingAs($this->user);

        $cra = CRA::factory()->create([
            'user_id' => $this->user->id,
            'status' => CraStatusEnum::NOT_SENT_TO_VALIDATION_YET->value,
            'created_at' => now(),
        ]);

        $response = $this->postJson(route('SendCraToValidation'));

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $cra->id,
                'status' => CraStatusEnum::WAITING_TO_VALIDATION->value,
            ]);

        $this->assertDatabaseHas('c_r_a_s', [
            'id' => $cra->id,
            'status' => CraStatusEnum::WAITING_TO_VALIDATION->value,
        ]);
    }
    /** @test */
    public function it_fails_gracefully_if_no_cra_exists_for_current_month_on_SendCraToValidation()
    {
        Carbon::setTestNow('2025-01-15');

        $this->actingAs($this->user);

        // No CRA created for this user
        $response = $this->postJson(route('SendCraToValidation'));

        $response->assertStatus(500); // Controller currently crashes on null $cra
    }
    /** @test */
    public function it_returns_validation_error_when_required_fields_are_missing_or_invalid()
    {
        $this->actingAs($this->user);

        // Missing both fields
        $response = $this->postJson(route('UpdateCommentOfTimeLigne'), []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['time_ligne', 'comment']);

        // Invalid types
        $response = $this->postJson(route('UpdateCommentOfTimeLigne'), [
            'time_ligne' => 'abc',
            'comment' => 123
        ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['time_ligne', 'comment']);
    }
    /** @test */
    public function it_returns_error_if_time_sheet_is_not_found()
    {
        $this->actingAs($this->user);

        $response = $this->postJson(route('UpdateCommentOfTimeLigne'), [
            'time_ligne' => 999,
            'comment' => 'Updated comment',
        ]);

        $response->assertStatus(200) // Controller currently returns 200
            ->assertExactJson(['msg' => 'time_ligne is not found']);
    }
    /** @test */
    public function it_updates_time_sheet_comment_successfully()
    {
        $this->actingAs($this->user);

        $timeSheet = TimeSheet::factory()->create([
            'comment' => 'Original comment',
            'user_id' => $this->user->id,
        ]);

        $response = $this->postJson(route('UpdateCommentOfTimeLigne'), [
            'time_ligne' => $timeSheet->id,
            'comment' => 'Updated comment',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $timeSheet->id,
                'comment' => 'Updated comment',
            ]);

        $this->assertDatabaseHas('time_sheets', [
            'id' => $timeSheet->id,
            'comment' => 'Updated comment',
        ]);
    }
    /** @test */
    public function it_returns_validation_error_if_id_is_invalid()
    {
        $this->actingAs($this->user);

        // Pass a string instead of integer
        $response = $this->getJson(route('getCra', ['id' => "www"]));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['id']);
    }
    /** @test */
    public function it_returns_not_found_if_cra_does_not_exist_on_getCra()
    {
        $this->actingAs($this->user);

        $response = $this->getJson(route('getCra', ['id' => 999]));

        $response->assertStatus(200) // Controller currently returns 200
            ->assertExactJson(['msg' => 'not found']);
    }
    /** @test */
    public function it_returns_cra_successfully()
    {
        $this->actingAs($this->user);

        $cra = CRA::factory()->create();

        $response = $this->getJson(route('getCra', ['id' => $cra->id]));

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $cra->id,
            ]);
    }
    /** @test */
    public function it_returns_false_if_no_cra_exists_for_current_month_and_year()
    {
        Carbon::setTestNow('2025-12-23');

        $this->actingAs($this->user);

        $response = $this->getJson(route('doasItHqveCraForTheCurrentTime'));

        $response->assertStatus(200)
            ->assertExactJson(['state' => false]);
    }
    /** @test */
    public function it_returns_true_if_cra_exists_for_current_month_and_year()
    {
        Carbon::setTestNow('2025-12-23');

        $this->actingAs($this->user);

        CRA::factory()->create([
            'user_id' => $this->user->id,
            'created_at' => now(),
        ]);

        $response = $this->getJson(route('doasItHqveCraForTheCurrentTime'));

        $response->assertStatus(200)
            ->assertExactJson(['state' => true]);
    }
    /** @test */
    public function it_returns_validation_error_if_cra_id_is_missing_or_invalid()
    {
        $this->actingAs($this->user);

        // Missing cra_id
        $response = $this->postJson(route('UpdateNumbersDaysOfCra'), []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['cra_id']);

        // Invalid cra_id
        $response = $this->postJson(route('UpdateNumbersDaysOfCra'), [
            'cra_id' => 'abc',
        ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['cra_id']);
    }
    /** @test */
    public function it_returns_not_found_if_cra_does_not_exist_on_UpdateNumbersDaysOfCra()
    {
        $this->actingAs($this->user);

        $response = $this->postJson(route('UpdateNumbersDaysOfCra'), [
            'cra_id' => 999,
        ]);

        $response->assertStatus(404)
            ->assertJsonFragment(['msg' => 'resource not foound']);
        // Assuming httpDefaultExceptionMesages->errorNotFound() returns ['message' => 'errorNotFound']
    }
    /** @test */
    public function it_updates_cra_fields_successfully()
    {
        $this->actingAs($this->user);

        $cra = CRA::factory()->create([
            'number_of_days_filled' => 0,
            'number_of_days_available' => 10,
            'progress' => 0,
        ]);

        $payload = [
            'cra_id' => $cra->id,
            'number_of_days_filled' => 5,
            'number_of_days_available' => 8,
            'progress' => 50,
        ];

        $response = $this->postJson(route('UpdateNumbersDaysOfCra'), $payload);

        $response->assertStatus(200)
            ->assertJsonFragment(['message' => 'CRA updated successfully.']);

        $this->assertDatabaseHas('c_r_a_s', [
            'id' => $cra->id,
            'number_of_days_filled' => 5,
            'number_of_days_available' => 8,
            'progress' => 50,
        ]);
    }
    /** @test */
    public function it_can_update_only_some_fields_of_cra()
    {
        $this->actingAs($this->user);

        $cra = CRA::factory()->create([
            'number_of_days_filled' => 0,
            'number_of_days_available' => 10,
            'progress' => 0,
        ]);

        $payload = [
            'cra_id' => $cra->id,
            'progress' => 75,
        ];

        $response = $this->postJson(route('UpdateNumbersDaysOfCra'), $payload);

        $response->assertStatus(200)
            ->assertJsonFragment(['message' => 'CRA updated successfully.']);

        $this->assertDatabaseHas('c_r_a_s', [
            'id' => $cra->id,
            'number_of_days_filled' => 0,
            'number_of_days_available' => 10,
            'progress' => 75,
        ]);
    }
}
