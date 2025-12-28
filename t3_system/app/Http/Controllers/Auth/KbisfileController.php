<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\FileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class KbisfileController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            'kbis*' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:10240'], // 10MB limit
            'logo*' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:10240'], // 255KB limit
            'organization_name' => ['required', 'string', 'max:255'],
        ]);

        $user = User::find(Auth::id());

        if (!$user) {
            return response()->json(['msg' => 'User not found'], 400);
        }

        // Handle kbis_file upload
        if ($request->hasFile('kbis')) {
            $kbis_file = FileService::StoreFileToPublicPath($request, 'kbis_file', 'kbis');
            $user->kbis_file = $kbis_file;
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $logo = FileService::StoreFileToPublicPath($request, 'logo', 'logo');
            $user->logo = $logo;
        }

        // Update organization_name
        $user->organization_name = $request->organization_name;

        // Save user
        $user->save();

        return redirect()->back();
    }

}
