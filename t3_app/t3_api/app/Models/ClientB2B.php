<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @mixin IdeHelperClientB2B
 */
class ClientB2B extends Model
{
    use HasFactory;
    protected $table = "client_b2b";

    protected $fillable = ["client_esoft_id", "client_b2b_name"];
    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, "client_b2b_id");
    }
    public function factures(): HasMany
    {
        return $this->hasMany(Facture::class, "client_b2b_id");
    }
    public function commercialData(): HasMany
    {
        return $this->hasMany(ClientCommercialData::class, 'client_b2b_id');
    }
    protected static function booted()
    {
        static::deleting(function ($clientB2B) {
            // Delete related commercial data
            $clientB2B->commercialData()->delete();
            $clientB2B->factures()->delete();

            // Delete related projects
            $clientB2B->projects()->each(function ($project) {
                $project->delete();
            });
        });
    }
}
