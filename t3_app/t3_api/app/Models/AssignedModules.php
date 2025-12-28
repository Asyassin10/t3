<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperAssignedModules
 */
class AssignedModules extends Model
{
    use HasFactory;
    protected $fillable = ["assigned_module_name"];
}
