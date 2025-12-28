<?php

namespace App\Http\Middleware;

use App\Enums\RoleEnumString;
use App\Services\AccountService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckAdminRole
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        $role = AccountService::getRoleById(role_id: $user->role_id);
        if ($user && $role->role_name === RoleEnumString::Admin->value) {
            return $next($request);
        }
        return response()->json(['error' => 'Unauthorized'], 403);
    }
}
