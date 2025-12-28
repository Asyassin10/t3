<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FilamentAdminMiddleware
{
    /**
     * Handle an incoming request.
     * Only allow users with role_id = 1 (Admin) to access Filament
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Check if user is authenticated and has role_id = 1
        if (!$user || $user->role_id !== 1) {
            abort(403, 'Access denied. Admin access only.');
        }

        return $next($request);
    }
}
