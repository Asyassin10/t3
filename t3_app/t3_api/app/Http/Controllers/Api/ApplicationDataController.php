<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApplicationData;
use App\Services\FileService;
use Illuminate\Http\Request;

class ApplicationDataController extends Controller
{

    public function getApplicationData()
    {
        return response()->json(ApplicationData::first());
    }
    public function updateApplicationData(Request $request)
    {
        $request->validate([
            'date_of_start_sending_notifications' => 'required|numeric',
        ]);
        $data = ApplicationData::first();
        $data->date_of_start_sending_notifications = $request->date_of_start_sending_notifications;
        $data->save();
        return response()->json(null, 200);
    }
    public function updateLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,webp',
        ]);
        $logo = null;
        if ($request->hasFile("logo")) {
            $logo = FileService::StoreFileToPublicPath($request, "logo", "logo");
        }
        $data = ApplicationData::first();
        $data->logo = $logo;
        $data->save();
        return response()->json($data, 200);
    }
}
