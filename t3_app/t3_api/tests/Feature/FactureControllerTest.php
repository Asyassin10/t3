<?php

namespace Tests\Feature;

use App\Enums\FactureStatus;
use App\Enums\RoleEnumString;
use App\Models\ClientB2B;
use App\Models\ClientEsoft;
use App\Models\ConsultantProject;
use App\Models\Facture;
use App\Models\Project;
use App\Models\User;
use App\Services\ExceptionMessagesService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use Tests\TestCase;
use ZipArchive;

class FactureControllerTest extends TestCase
{
    use RefreshDatabase;
    protected User $user;
    protected ClientB2B $clientB2B;
    protected Project $project;
    protected function setUp(): void
    {
        parent::setUp();
        // Run any necessary seeding or setup
        $this->artisan(command: 'init-database')->run();
        $this->user = User::factory()
            ->withRole(role_name: RoleEnumString::ClientEsoft->value)
            ->create();

        $this->clientB2B = ClientB2B::factory()->create([]);

        $this->project = Project::factory()->create([
            'client_b2b_id' => $this->clientB2B->id
        ]);

        $this->actingAs($this->user);
    }
    public function test_it_validates_get_factures_request()
    {
        $response = $this->getJson('/api/facture/get_factures?page=0&value=too_long_value_exceeding_255_characters_' . Str::random(300));
        $response->assertStatus(422)
            ->assertJsonStructure(['errors']);
    }
    public function test_it_returns_factures_for_client_esoft()
    {
        Facture::factory()->count(2)->create([
            'client_b2b_id' => $this->clientB2B->id
        ]);

        $response = $this->getJson('/api/facture/get_factures');

        $response->assertStatus(200)
            ->assertJsonFragment(['client_b2b_id' => $this->clientB2B->id]);
    }
    public function test_it_saves_facture_successfully()
    {
        $payload = [
            'year' => now()->year,
            'month' => now()->month,
            'project_id' => $this->project->id
        ];

        $response = $this->postJson('/api/facture/save_facture', $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'facture' => ['id', 'numero_facture', 'year', 'month', 'date_facture', 'facture_path', 'client_b2b_id'],
                'full_path'
            ]);

        $this->assertDatabaseHas('factures', [
            'client_b2b_id' => $this->clientB2B->id,
            'year' => $payload['year'],
            'month' => $payload['month']
        ]);
    }
    public function test_it_sets_facture_as_paid()
    {
        $facture = Facture::factory()->create([
            'client_b2b_id' => $this->clientB2B->id
        ]);

        $response = $this->postJson('/api/facture/make-it-paid', [
            'facture_id' => $facture->id
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('factures', [
            'id' => $facture->id,
            'status' => FactureStatus::PAID->value
        ]);
    }
    public function test_it_sets_note_for_facture()
    {
        $facture = Facture::factory()->create([
            'client_b2b_id' => $this->clientB2B->id
        ]);

        $note = "This is a test note";

        $response = $this->postJson('/api/facture/save-note', [
            'facture_id' => $facture->id,
            'note' => $note
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['note' => $note]);
    }

    public function test_it_returns_error_if_facture_not_found()
    {
        $response = $this->postJson('/api/facture/make-it-paid', ['facture_id' => 999]);

        $response->assertStatus(404)
            ->assertJson(['msg' => 'facture not found']);
    }
    public function test_it_validates_generate_pdf_request()
    {
        $response = $this->postJson('/api/facture/generate-pdf', [
            'year' => 'not_numeric',
            'month' => 'not_numeric',
            'facture_id' => 'not_numeric'
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['errors']);
    }
    public function test_it_generates_pdf_successfully()
    {
        $facture = Facture::factory()->create([
            'client_b2b_id' => $this->clientB2B->id
        ]);

        $response = $this->postJson('/api/facture/generate-pdf', [
            'year' => now()->year,
            'month' => now()->month,
            'facture_id' => $facture->id
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'facture' => ['id', 'numero_facture'],
                'full_path'
            ]);
    }
    public function test_it_validates_delete_pdf_request()
    {
        $response = $this->postJson('/api/facture/deletePdf', [
            'app_url' => 'not-a-valid-url',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['errors']);
    }
    public function test_it_deletes_pdf_successfully()
    {
        // Arrange
        $fileName = 'test_facture.pdf';
        $pdfDirectory = public_path('pdfs');

        if (!file_exists($pdfDirectory)) {
            mkdir($pdfDirectory, 0777, true);
        }

        $fullPath = $pdfDirectory . '/' . $fileName;

        // Create fake PDF file
        file_put_contents($fullPath, 'fake pdf content');

        $this->assertFileExists($fullPath);

        $appUrl = url('/pdfs/' . $fileName);

        // Act
        $response = $this->postJson('/api/facture/deletePdf', [
            'app_url' => $appUrl,
        ]);

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'ok' => true,
            ]);

        $this->assertFileDoesNotExist($fullPath);
    }
    public function test_it_returns_false_if_pdf_does_not_exist()
    {
        $appUrl = url('/pdfs/non_existing_file.pdf');

        $response = $this->postJson('/api/facture/deletePdf', [
            'app_url' => $appUrl,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'ok' => false,
            ]);
    }
    public function test_it_returns_404_when_setting_note_on_non_existing_facture()
    {
        $payload = [
            'facture_id' => 999999, // ID that does not exist
            'note' => 'This note should fail',
        ];

        $response = $this->postJson('/api/facture/save-note', $payload);

        $response->assertStatus(404)
            ->assertJson([
                'msg' => 'facture not found',
            ]);
    }
    public function test_generate_pdf_returns_404_if_facture_not_found()
    {
        $response = $this->postJson('/api/facture/generate-pdf', [
            'year' => now()->year,
            'month' => now()->month,
            'facture_id' => 999999, // non existing
        ]);

        $response->assertStatus(404)
            ->assertJson([
                'msg' => 'facture not found',
            ]);
    }
    public function test_save_factures_of_client_validation_fails()
    {
        $response = $this->postJson('/api/facture/save_factures_of_clients', [
            'year' => 'abc',
            'month' => 'abc',
            'client_id' => 'abc',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['errors']);
    }
    public function test_save_factures_of_client_returns_no_projects()
    {
        $client = ClientB2B::factory()->create();

        $response = $this->postJson('/api/facture/save_factures_of_clients', [
            'year' => now()->year,
            'month' => now()->month,
            'client_id' => $client->id,
        ]);

        $response->assertStatus(500)
            ->assertJson([
                'message' => 'no_projects',
            ]);
    }
    public function test_save_factures_of_client_generates_zip_successfully()
    {
        // Arrange
        $client = ClientB2B::factory()->create();

        $project = Project::factory()->create([
            'client_b2b_id' => $client->id,
        ]);

        // Needed for nombre_consultant
        ConsultantProject::factory()->count(2)->create([
            'project_id' => $project->id,
        ]);

        // Ensure folders exist
        if (!file_exists(public_path('pdfs'))) {
            mkdir(public_path('pdfs'), 0777, true);
        }

        if (!file_exists(public_path('exports'))) {
            mkdir(public_path('exports'), 0777, true);
        }

        // Fake PDF file (FactureService generates URLs)
        $fakePdfName = 'test_invoice.pdf';
        file_put_contents(
            public_path('pdfs/' . $fakePdfName),
            'fake pdf content'
        );

        // Act
        $response = $this->postJson('/api/facture/save_factures_of_clients', [
            'year' => now()->year,
            'month' => now()->month,
            'client_id' => $client->id,
        ]);

        // Assert
        $response->assertStatus(200)
            ->assertJsonStructure([
                'client' => ['id'],
                'full_path',
            ]);

        $zipUrl = $response->json('full_path');
        $zipPath = public_path(
            str_replace(asset('/'), '', $zipUrl)
        );

        $this->assertFileExists($zipPath);
    }
    public function test_save_factures_of_client_creates_facture_if_not_exists()
    {
        $client = ClientB2B::factory()->create();

        $project = Project::factory()->create([
            'client_b2b_id' => $client->id,
        ]);

        $this->assertDatabaseMissing('factures', [
            'client_b2b_id' => $client->id,
            'year' => now()->year,
            'month' => now()->month,
        ]);

        $this->postJson('/api/facture/save_factures_of_clients', [
            'year' => now()->year,
            'month' => now()->month,
            'client_id' => $client->id,

        ]);

        $this->assertDatabaseHas('factures', [
            'client_b2b_id' => $client->id,
            'year' => now()->year,
            'month' => now()->month,
        ]);
    }
    public function test_save_factures_of_client_creates_exports_directory_if_not_exists()
    {
        // Arrange
        $client = ClientB2B::factory()->create();

        $project = Project::factory()->create([
            'client_b2b_id' => $client->id,
        ]);

        ConsultantProject::factory()->create([
            'project_id' => $project->id,
        ]);

        $exportsPath = public_path('exports');

        // Make sure folder does NOT exist
        if (file_exists($exportsPath)) {
            array_map('unlink', glob("$exportsPath/*"));
            rmdir($exportsPath);
        }

        $this->assertDirectoryDoesNotExist($exportsPath);

        // Act
        $response = $this->postJson('/api/facture/save_factures_of_clients', [
            'year' => now()->year,
            'month' => now()->month,
            'client_id' => $client->id,
        ]);

        // Assert
        $response->assertStatus(200);
        $this->assertDirectoryExists($exportsPath);
    }
    public function test_get_factures_filters_by_selected_month()
    {
        $month = 5;
        $year = now()->year;

        // Matching facture
        Facture::factory()->create([
            'client_b2b_id' => $this->clientB2B->id,
            'created_at' => Carbon::create($year, $month, 10),
        ]);

        // Non-matching facture
        Facture::factory()->create([
            'client_b2b_id' => $this->clientB2B->id,
            'created_at' => Carbon::create($year, $month + 1, 10),
        ]);

        $response = $this->getJson("/api/facture/get_factures?selectedMonth={$month}");

        $response->assertStatus(200);

        foreach ($response->json('data') as $facture) {
            $this->assertEquals($month, Carbon::parse($facture['created_at'])->month);
        }
    }
    public function test_get_factures_filters_by_selected_year()
    {
        $year = now()->year;

        Facture::factory()->create([
            'client_b2b_id' => $this->clientB2B->id,
            'created_at' => Carbon::create($year, 6, 10),
        ]);

        Facture::factory()->create([
            'client_b2b_id' => $this->clientB2B->id,
            'created_at' => Carbon::create($year - 1, 6, 10),
        ]);

        $response = $this->getJson("/api/facture/get_factures?selectedYear={$year}");

        $response->assertStatus(200);

        foreach ($response->json('data') as $facture) {
            $this->assertEquals($year, Carbon::parse($facture['created_at'])->year);
        }
    }
    public function test_get_factures_filters_by_client_b2b()
    {
        $otherClient = ClientB2B::factory()->create();

        Facture::factory()->create([
            'client_b2b_id' => $this->clientB2B->id,
        ]);

        Facture::factory()->create([
            'client_b2b_id' => $otherClient->id,
        ]);

        $response = $this->getJson(
            "/api/facture/get_factures?clientB2b={$this->clientB2B->id}"
        );

        $response->assertStatus(200);

        foreach ($response->json('data') as $facture) {
            $this->assertEquals($this->clientB2B->id, $facture['client_b2b_id']);
        }
    }
}
