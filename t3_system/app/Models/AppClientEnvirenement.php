<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppClientEnvirenement extends Model
{
    use HasFactory;
    protected $fillable = [
        'email',
        'name',
        'password',
        'user_id',
        'modules',
        'app_api_key',
        'user_subscriptionplan_date_start',
        'user_subscriptionplan_date_end',
        'paye',
        "status"
    ];
    protected $casts = [
        'modules' => 'array',
        'user_subscriptionplan_date_start' => 'date',
        'user_subscriptionplan_date_end' => 'date',
    ];
    protected $hidden = [
        'password',
        'app_api_key',
    ];
}
