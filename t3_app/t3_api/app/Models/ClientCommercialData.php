<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperClientCommercialData
 */
class ClientCommercialData extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_b2b_id',
        'key',
        'value',
    ];

    /**
     * Relationship with ClientB2B model
     */
    public function clientB2b()
    {
        return $this->belongsTo(ClientB2B::class, 'client_b2b_id');
    }
}
