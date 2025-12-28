<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperJourferier
 */
class Jourferier extends Model
{
    use HasFactory;
    protected $fillable = [
        'jourferiers_date',
        'description',
        'number_days'
    ];
}
