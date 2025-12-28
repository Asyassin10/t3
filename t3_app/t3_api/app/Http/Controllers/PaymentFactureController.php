<?php

namespace App\Http\Controllers;

use App\Models\Facture;
use App\Models\PaymentFacture;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentFactureController extends Controller
{
    //
    public function savePaymentForFacture(Request $request): JsonResponse
    {
        $request->validate([
            "amount" => "required|numeric",
            "payment_method" => "required|string|max:255",
            "facture_id" => "required|numeric",
        ]);
        $facture = Facture::find($request->integer("facture_id"));
        if (!$facture) {
            return response()->json(["msg" => "facture not found"], 404);
        }
        $payment = PaymentFacture::create([
            "facture_id" => $facture->id,
            "reference" => Str::uuid(),
            "amount" => $request->integer("amount"),
            "currency" => "EUR",
            "payment_method" => $request->string("payment_method"),
        ]);
        return response()->json($payment);
    }
}
