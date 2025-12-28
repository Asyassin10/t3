<?php

namespace App\Http\Middleware;

use App\Enums\RoleEnumString;
use App\Services\AccountService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckClientEsoft
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated
        $user = Auth::user();
        if ($user) {
            $role = AccountService::getRoleById(role_id: $user->role_id);
            if ($role->role_name == RoleEnumString::ClientEsoft->value) {
                return $next($request);
            }
        }

        return response()->json(['error' => 'Unauthorized'], 403);
    }
}
