<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ConsultantProject extends Pivot
{
    protected $table = 'consultant_projects';

    use HasFactory;
    protected $fillable = ["consultant_id", "project_id", "price_per_day"];
    public function activite()
    {
        return $this->hasMany(Activite::class, "consultant_project_id");
    }
    public function concultants()
    {
        return $this->belongsTo(Consultant::class);
    }
}
