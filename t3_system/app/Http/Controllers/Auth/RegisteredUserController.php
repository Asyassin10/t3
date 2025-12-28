<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use App\Services\FileService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\View\View;
use Exception;
use Laravel\Socialite\Facades\Socialite;


class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): View
    {
        return view('auth.register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            //  'organization' => ['required', 'string', 'max:255'],
            // 'kbis' => ['required', 'max:255', 'file', 'mimes:pdf,jpg,jpeg,png'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
        /* $kbis_file = null;
        if ($request->hasFile("kbis")) {
            $kbis_file = FileService::StoreFileToPublicPath($request, "kbis_file", "kbis");
        } */
        $apiKey = Str::random(60);
        $role = Role::where("role_name", "ClientEsoft")->first();
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'app_api_key' => $apiKey,
            "role_id" => $role->id,
            //  "is_complete_profile" => false,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }
    /**
     * Redirect the user to the GitHub authentication page.
     *
     * @return \Illuminate\Http\Response
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from GitHub.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Http\Response|\Illuminate\Routing\Redirector
     */
    public function handleGoogleCallback()
    {
        try {
            //create a user using socialite driver google
            $user = Socialite::driver('google')->user();
            // if the user exits, use that user and login
            $finduser = User::where('google_id', $user->id)->first();
            if ($finduser) {
                //if the user exists, login and show dashboard
                Auth::login($finduser);
                return redirect('/dashboard');
            } else {
                //user is not yet created, so create first
                $apiKey = Str::random(60);
                $newUser = User::create([
                    'name' => $user->name,
                    'email' => $user->email,
                    'google_id' => $user->id,
                    'app_api_key' => $apiKey,
                    'password' => encrypt('')
                ]);
                //login as the new user
                Auth::login($newUser);
                // go to the dashboard
                return redirect('/dashboard');
            }
            //catch exceptions
        } catch (Exception $e) {
            dd($e->getMessage());
        }
    }
}
