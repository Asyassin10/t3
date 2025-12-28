<?php

namespace App\Models;

use App\Casts\IdsOfDaysCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperTimeSheet
 */
class TimeSheet extends Model
{
    use HasFactory;
    protected $fillable = [
        'project_id',
        'activite_id',
        'ids_of_days',
        'count_of_days',
        'date',
        "user_id",
        "cra_id"
    ];
    protected $casts = [
        'ids_of_days' => IdsOfDaysCast::class,
    ];

    protected static function booted()
    {
        static::deleting(function ($timeSheet) {
            // delete lignes first
            $timeSheet->time_sheet_ligne()->delete();

            // delete CRA if needed
            if ($timeSheet->cra) {
                $timeSheet->cra()->delete();
            }
        });
    }

    public function time_sheet_ligne()
    {
        return $this->hasMany(TimeSheetLigne::class, "time_sheet_id");
    }
    public function cra()
    {
        return $this->belongsTo(CRA::class, "cra_id");
    }
    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
    public function project()
    {
        return $this->belongsTo(Project::class, "project_id");
    }
    public function activite()
    {
        return $this->belongsTo(Activite::class, "activite_id");
    }
}
