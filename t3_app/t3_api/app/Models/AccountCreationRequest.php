<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperAccountCreationRequest
 */
class AccountCreationRequest extends Model
{
    use HasFactory;
    protected $fillable = ["is_valid", "token", "user_id"];
}
