<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperModule
 */
class Module extends Model
{
    use HasFactory;
    protected $fillable = [
        "module_name",
        "description",
        "full_name",
    ];
}
