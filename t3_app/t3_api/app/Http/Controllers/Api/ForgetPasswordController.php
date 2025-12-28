<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\CodeConfirmation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ForgetPasswordController extends Controller
{
    //
    public function CheckEmailAndSendCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);
        // send email with code
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Cette adresse email n\'est pas enregistrée.'], 404);
        }
        $otp_code = random_int(111111, 999999);

        $user->code_otp = $otp_code;
        $user->save();
        $user->notify(new CodeConfirmation($otp_code));
        return response()->json(['message' => 'Votre code de réinitialisation a été envoyé à votre adresse email.']);
    }

    public function ValidateCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code_otp' => 'required|numeric'
        ]);
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Cette adresse email n\'est pas enregistrée.'], 404);
        }
        if ($user->code_otp == $request->code_otp) {
            $user->token_change_mdp = Str::random(80);
            $user->save();
            return response()->json(['message' => 'Code valide', 'code' => $user->token_change_mdp]);
        } else {
            return response()->json(['message' => 'Code invalide'], 400);
        }
    }
    // reset_password route
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'password' => 'required|min:8|confirmed'
        ]);
        $user = User::where('token_change_mdp', $request->token)->first();
        if (!$user) {
            return response()->json(['message' => 'Token invalide'], 404);
        }
        $user->password = Hash::make($request->password);
        $user->token_change_mdp = null;
        $user->save();
        return response()->json(['message' => 'Mot de passe modifié avec succès']);
    }
}
