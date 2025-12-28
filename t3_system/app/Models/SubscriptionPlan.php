<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;
    protected $fillable = ["subscription_plan_name", "identifier", "stripe_id"];
    public function modules()
    {
        return $this->hasMany(Module::class);
    }
}
