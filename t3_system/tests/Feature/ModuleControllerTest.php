<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscriptionplan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Mockery;

class ModuleControllerTest extends TestCase
{

    protected $user;
    protected $subscriptionPlan;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a test user and authenticate
        $this->user = User::factory()->create();
        Auth::login($this->user);

        // Create a test subscription plan
        $this->subscriptionPlan = SubscriptionPlan::factory()->create([
            'stripe_id' => 'test_stripe_id',
            'free_trial_days_count' => 14
        ]);
    }

    /** @test */
    public function test_list_modules_returns_view_with_subscription_plans()
    {
        // Create a user subscription plan
        UserSubscriptionplan::factory()->create([
            'user_id' => $this->user->id,
            'subscription_plan_id' => $this->subscriptionPlan->id
        ]);

        $response = $this->actingAs($this->user)->get(route('listModules'));

        $response->assertViewIs('profile.listModules')
            ->assertViewHas('subscription_plans');
    }

    /** @test */
    public function test_abonnements_returns_view_with_user_subscriptions()
    {
        // Create a user subscription plan
        UserSubscriptionplan::factory()->create([
            'user_id' => $this->user->id,
            'subscription_plan_id' => $this->subscriptionPlan->id
        ]);

        $response = $this->actingAs($this->user)->get(route('Abonnements'));

        $response->assertViewIs('profile.Abonnements')
            ->assertViewHas('data');
    }

    /** @test */
    /*   public function test_handle_subscription_success_creates_user_subscription_plan()
    {
        // Mock Redis to prevent actual publishing
        Redis::shouldReceive('publish')->once();

        $response = $this->actingAs($this->user)
                         ->get(route('HandleSubscriptionSuccess', ['plan_id' => $this->subscriptionPlan->id]));

        // Assert user subscription plan was created
        $this->assertDatabaseHas('user_subscriptionplans', [
            'user_id' => $this->user->id,
            'subscription_plan_id' => $this->subscriptionPlan->id
        ]);

        // Assert redirect
        $response->assertRedirect(route('Abonnements'))
                 ->assertSessionHas('success', 'Abonnement gekoppelt met succes!');
    } */

    /** @test */
    public function test_handle_subscription_not_success_returns_user()
    {
        $response = $this->actingAs($this->user)
            ->get(route('HandleSubscriptionNotSuccess', ['plan_id' => $this->subscriptionPlan->id]));

        $response->assertJson([
            'id' => $this->user->id,
            'email' => $this->user->email
        ]);
    }

    /** @test */
    public function test_create_checkout_initiates_subscription()
    {
        $response = $this->actingAs($this->user)
            ->get(route('crateCheckout', ['plan_id' => $this->subscriptionPlan->id]));

        // Assert response is a Stripe checkout session
        $response->assertStatus(302); // Redirect to Stripe
    }

    /** @test */
    public function test_user_subscription_plan_service_payment_date_check()
    {
        // Create a user subscription plan
        $userSubscriptionPlan = UserSubscriptionplan::factory()->create([
            'user_id' => $this->user->id,
            'subscription_plan_id' => $this->subscriptionPlan->id,
            'user_subscriptionplan_date_start' => Carbon::now()->subMonths(2),
            'user_subscriptionplan_date_end' => Carbon::now()->addMonths(10)
        ]);

        // Use reflection to test the private method
        $service = new \App\Services\UserSubscriptionplanService();
        $method = new \ReflectionMethod($service, 'CheckPaymentDateIfItIsPassed');
        $method->setAccessible(true);

        $result = $method->invoke($service, $userSubscriptionPlan);

        $this->assertTrue($result);

        // Test with expired subscription
        $expiredSubscriptionPlan = UserSubscriptionplan::factory()->create([
            'user_id' => $this->user->id,
            'subscription_plan_id' => $this->subscriptionPlan->id,
            'user_subscriptionplan_date_start' => Carbon::now()->subYears(2),
            'user_subscriptionplan_date_end' => Carbon::now()->subMonths(1)
        ]);

        $result = $method->invoke($service, $expiredSubscriptionPlan);

        $this->assertFalse($result);
    }
}
