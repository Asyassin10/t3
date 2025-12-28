<?php

namespace App\Models;

use App\Casts\TimeSheetLigneCastOfValue;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperTimeSheetLigne
 */
class TimeSheetLigne extends Model
{
    use HasFactory;
    protected $fillable = ["value","is_week_end","is_disabled","rest_acceptable","time_sheet_id","app_id"];

    protected $casts = [
        'is_disabled' => "boolean",
        'is_week_end' => "boolean",
        "value"=>TimeSheetLigneCastOfValue::class
    ];
}
