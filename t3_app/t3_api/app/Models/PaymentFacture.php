<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperPaymentFacture
 */
class PaymentFacture extends Model
{
    use HasFactory;
    protected $fillable = [
        'facture_id',
        'reference',
        'amount',
        'currency',
        'payment_method',
    ];


    public function facture()
    {
        return $this->belongsTo(Facture::class);
    }
}
