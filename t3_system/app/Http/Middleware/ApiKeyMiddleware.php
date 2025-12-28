<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiKeyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = $request->header('API-KEY');

        if (!$apiKey) {
            return response()->json(['error' => 'API key is missing'], 401);
        }

        $user = User::where('app_api_key', $apiKey)->first();

        if (!$user) {
            return response()->json(['error' => 'Invalid API key'], 401);
        }

        // Set the user in the request for further use
        $request->attributes->set('user', $user);

        return $next($request);

    }
}
