<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectManager extends Pivot
{
    protected $table = "project_managers";
    use HasFactory;
    protected $fillable = [
        "project_id",
        "manager_id",
        "project_manager_price_per_day",
        "date_of_start",
        "date_of_end",
    ];
}
