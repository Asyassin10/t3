<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Notifications\AccountActivationNotification;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AccountCreationRequest;
use Illuminate\Support\Facades\Notification;

use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function accept_account_request(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);
        $email = $request->email;
        $token = Str::random(20); // Générer un jeton d'activation

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }
        $user->is_valid = true;
        $user->account_token = $token;
        $user->save();



        // Envoyer la notification
        $user->notify(new AccountActivationNotification($user, $token));
        return response()->json(['message' => 'Account request accepted. Activation email sent.'], 200);
    }
}
