<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LanguageController extends Controller
{
    //
    public function setLanguage(Request $request)
    {

        $request->validate([
            'lang' => 'required|in:fr,en|string|max:255'
        ]);
        $user = User::find(Auth::id());
        $user->language = $request->string("lang");
        $user->save();
        return response()->json([
            'message' => 'Operation done successfully'
        ]);
    }
    public function getLanguage()
    {
        $user = User::find(Auth::id());
        return response()->json([
            'lang' => $user->language
        ]);
    }
}
