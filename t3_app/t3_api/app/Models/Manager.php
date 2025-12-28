<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Manager extends Model
{
    use HasFactory;

    protected $fillable = ["client_esoft_id", "user_id"];
    /**
     * @return BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
    /**
     * @return BelongsTo
     */
    public function client_esoft()
    {
        return $this->belongsTo(ClientEsoft::class, "client_esoft_id");
    }
    /**
     * @return BelongsToMany
     */
    public function consultants()
    {
        return $this->belongsToMany(
            Consultant::class,
            "manager_consultant",
            "manager_id",
            "consultants_id",
        );
    }
    /** ✅ Manager ↔ Projects */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, "project_managers")
            ->using(ProjectManager::class)
            ->withPivot([
                "project_manager_price_per_day",
                "date_of_start",
                "date_of_end",
            ])
            ->withTimestamps();
    }
}
