<?php

namespace App\Models;

use App\Enums\FactureStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperFacture
 */
class Facture extends Model
{
    use HasFactory;
    protected $fillable = [
        "year",
        "month",
        "date_facture",
        "nombre_consultant",
        "numero_facture",
        "client_b2b_id",
        "facture_path",
        "note",
        "status",
        "paid_at",
    ];
    protected $casts = [
        "paid_at" => "datetime",
        "status" => FactureStatus::class,
    ];
}
