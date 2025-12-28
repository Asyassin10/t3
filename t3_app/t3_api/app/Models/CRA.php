<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperCRA
 */
class CRA extends Model
{
    use HasFactory;
    protected $fillable = ["user_id", "status", "number_of_days_available", "number_of_days_filled", "progress"];
    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
    public function time_sheet()
    {
        return $this->hasMany(TimeSheet::class, "cra_id");
    }
}
