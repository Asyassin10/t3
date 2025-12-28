<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperClientEsoft
 */
class ClientEsoft extends Model
{
    //ClientEsoft::all()
    use HasFactory;
    protected $table = "clientesoft";
    protected $fillable = ["user_id", "kbis_file", "app_api_key", "user_subscriptionplan_date_end", "user_subscriptionplan_date_start"];
    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
}
