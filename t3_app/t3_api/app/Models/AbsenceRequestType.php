<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperAbsenceRequestType
 */
class AbsenceRequestType extends Model
{
    use HasFactory;
    protected $fillable = ["label_type_absence"];
}
