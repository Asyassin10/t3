<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\App;

class SetUserLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = 'en'; // default fallback

        if (Auth::check()) {
            $user = Auth::user();
            if (!empty($user->language) && in_array($user->language, ['fr', 'en'])) {
                $locale = $user->language;
            }
        }

        App::setLocale($locale);
        return $next($request);
    }
}
