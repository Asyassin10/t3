<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssignedModules;
use App\Models\Module;
use App\Models\User;
use App\Services\AccountService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ModuleController extends Controller
{



    public function ListAccessibleModules(): JsonResponse
    {
        $modules = AssignedModules::all();
        return response()->json($modules);
    }
}
