<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSubscriptionplan extends Model
{
    use HasFactory;
    protected $fillable = [
        "user_id",
        "subscription_plan_id",
        "user_subscriptionplan_date_start",
        "user_subscriptionplan_date_end",
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function subscription_plan()
    {
        return $this->belongsTo(SubscriptionPlan::class);
    }
}
