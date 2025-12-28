<?php

namespace Tests\Feature;

use App\Enums\RoleEnumString;
use App\Models\ClientEsoft;
use App\Models\Facture;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PaymentFactureControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Run any necessary seeding or setup
        $this->artisan(command: 'init-database')->run();
    }
    /** @test */
    public function test_it_fails_validation_when_required_fields_are_missing()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);
        $this->actingAs($user);

        $response = $this->postJson('/api/payments_factures/save', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['amount', 'payment_method', 'facture_id']);
    }
    public function test_it_returns_404_if_facture_does_not_exist()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);
        $this->actingAs($user);

        $payload = [
            'amount' => 100,
            'payment_method' => 'Credit Card',
            'facture_id' => 999 // non-existing
        ];

        $response = $this->postJson('/api/payments_factures/save', $payload);

        $response->assertStatus(404)
            ->assertJson([
                'msg' => 'facture not found'
            ]);
    }
    public function test_it_creates_payment_successfully()
    {
        $user = User::factory()->withRole(role_name: RoleEnumString::ClientEsoft->value)->create();
        $clientEsoft = ClientEsoft::factory()->create([
            'user_id' => $user->id,
        ]);
        $this->actingAs($user);

        $facture = Facture::factory()->create();

        $payload = [
            'amount' => 250,
            'payment_method' => 'PayPal',
            'facture_id' => $facture->id,
        ];

        $response = $this->postJson('/api/payments_factures/save', $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'facture_id',
                'reference',
                'amount',
                'currency',
                'payment_method',
                'created_at',
                'updated_at'
            ])
            ->assertJson([
                'facture_id' => $facture->id,
                'amount' => 250,
                'payment_method' => 'PayPal',
                'currency' => 'EUR'
            ]);

        $this->assertDatabaseHas('payment_factures', [
            'facture_id' => $facture->id,
            'amount' => 250,
            'payment_method' => 'PayPal'
        ]);
    }
}
