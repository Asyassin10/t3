<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Project extends Model
{
    use HasFactory;
    protected $fillable = ["client_b2b_id", "project_name", "codeprojet", "dure", "info", "status", "manager_id", "client_esoft_id"];
    public function activities()
    {
        return $this->hasMany(Activite::class, "project_id");
    }
    public function timeSheets()
    {
        return $this->hasMany(TimeSheet::class, "project_id");
    }
    public function project_b_to_b()
    {
        return $this->belongsTo(ClientB2B::class, "client_b2b_id");
    }
    protected static function booted()
    {
        static::deleting(function ($project) {
            $project->managers()->detach();
            $project->consultants()->detach();

            // Delete
            $project->activities()->delete();
            $project->timeSheets()->delete();
        });
    }
    /** ✅ Project ↔ Managers */
    public function managers(): BelongsToMany
    {
        return $this->belongsToMany(
            Manager::class,
            'project_managers'
        )
            ->using(ProjectManager::class)
            ->withPivot([
                'project_manager_price_per_day',
                'date_of_start',
                'date_of_end'
            ])
            ->withTimestamps();
    }

    /** ✅ Project ↔ Consultants */
    public function consultants(): BelongsToMany
    {
        return $this->belongsToMany(
            Consultant::class,
            'consultant_projects'
        )
            ->using(ConsultantProject::class)
            ->withPivot('price_per_day')
            ->withTimestamps();
    }
}
