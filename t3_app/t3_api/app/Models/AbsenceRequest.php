<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperAbsenceRequest
 */
class AbsenceRequest extends Model
{
    use HasFactory;
    protected $fillable = ["type_absence_id", 'status', "reason", "nombre_des_jours", "date_debut", "date_fin", "date_exacte", "date_validation", "is_valid", "user_id"];

    public function type_absence()
    {
        return $this->belongsTo(AbsenceRequestType::class, "type_absence_id");
    }
    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
    protected $casts = [
        "is_valid" => "boolean",
    ];
}
