<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperApplicationData
 */
class ApplicationData extends Model
{
    use HasFactory;
    protected $fillable = ["date_of_start_sending_notifications", "logo"];
}
