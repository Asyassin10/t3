<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultant extends Model
{
    use HasFactory;
    protected $fillable = ["user_id", "client_esoft_id", "professionality"];
    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
    /*  public function projects()
    {
        return $this->belongsToMany(Project::class, 'consultant_projects');
    } */
    public function projects()
    {
        return $this->belongsToMany(
            Project::class,
            'consultant_projects'
        )
            ->using(ConsultantProject::class)
            ->withPivot('price_per_day')
            ->withTimestamps();
    }
    public function managers()
    {
        return $this->belongsToMany(
            Manager::class,
            'manager_consultant',
            'consultants_id',
            'manager_id'
        );
    }
}
