<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApiKeySetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'api_key',
        'last_checked_at',
    ];

    protected $casts = [
        'last_checked_at' => 'datetime',
    ];

}