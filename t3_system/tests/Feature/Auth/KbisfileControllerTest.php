<?php

namespace Tests\Feature\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class KbisfileControllerTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        // Use in-memory storage for testing
        Storage::fake('public');
    }
    public function testStoreValidRequest(): void
    {
        // Fake the storage disk to avoid actual file writes
        Storage::fake('public');
    
        // Create a mock user
        $user = User::factory()->create();
    
        // Act as the user
        $this->actingAs($user);
    
        // Mock files for upload as plain files (no GD needed)
        $kbisFile = UploadedFile::fake()->create('test.pdf', 100, 'application/pdf');
        $logoFile = UploadedFile::fake()->create('test.png', 50, 'image/png'); // Valid image type
    
        // Send request
        $response = $this->post(route('kbis.verification-kbis'), [
            'kbis' => $kbisFile,
            'logo' => $logoFile,
            'organization_name' => 'Test Organization',
        ]);
    
        // Assert redirection
        $response->assertRedirect();


    }
    
    
    
    

    public function testStoreInvalidRequest(): void
    {
        // Create a mock user
        $user = User::factory()->create();

        // Act as the user
        $this->actingAs($user);

        // Send an invalid request (missing required fields)
        $response = $this->post(route('kbis.verification-kbis'), [
            'kbis' => "",
            'logo' => "",
            'organization_name' => '',
        ]);
        // Assert validation errors
        $response->assertSessionHasErrors(['kbis*', 'logo*', 'organization_name']);
    }

     public function testStoreWithoutAuthentication(): void
    {
        $kbisFile = UploadedFile::fake()->create('test.pdf', 100, 'application/pdf');
        $logoFile = UploadedFile::fake()->create('test.png', 50, 'image/png'); // Valid image type
    
        // Send request
        $response = $this->post(route('kbis.verification-kbis'), [
            'kbis' => $kbisFile,
            'logo' => $logoFile,
            'organization_name' => 'Test Organization',
        ]);
    
        // Assert redirection
        $response->assertRedirect();
    } 
}
