<?php

namespace App\Http\Controllers\Api;

use App\Enums\AbsenceRequestStatusEnum;
use App\Enums\RoleEnum;
use App\Enums\RoleEnumString;
use App\Http\Controllers\Controller;
use App\Models\AbsenceRequest;
use App\Models\AbsenceRequestType;
use App\Models\ClientEsoft;
use App\Models\Consultant;
use App\Models\CRA;
use App\Models\Manager;
use App\Models\Project;
use App\Models\User;
use App\Services\AccountService;
use App\Services\ExceptionMessagesService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AbsenceController extends Controller
{
    public function CreateAbsenceRequest(Request $request)
    {
        $request->validate([
            "reason" => "required|string|max:255",
            "absence_request_type_id" => "required|numeric",
            "date_debut" => "date|required|date_format:Y-m-d",
            "date_fin" => "date|required|date_format:Y-m-d|after:date_debut",
        ]);

        $date1 = Carbon::parse($request->date_debut);
        $date2 = Carbon::parse($request->date_fin);
        $daysDiff = $date1->diffInDays($date2);
        return AbsenceRequest::create([
            "type_absence_id" => $request->absence_request_type_id,
            "nombre_des_jours" => $daysDiff,
            "date_debut" => $request->date_debut,
            "date_fin" => $request->date_fin,
            "date_exacte" => $request->date_exacte,
            "reason" => $request->reason,
            "user_id" => Auth::id(),
        ]);
    }

    public function GetAbsenceOfDateMonthAndYear(Request $request)
    {
        $request->validate([
            "year" => "required|numeric",
            "month" => "required|numeric",
            'id' => 'required|numeric',
        ]);
        $cra = CRA::find($request->id);
        if (!$cra) {
            return response()->json([
                'msg' => 'not found',
            ]);
        }
        $user = $cra->user;
        $absences = AbsenceRequest::whereYear("date_debut", $request->year)
            ->whereMonth("date_debut", $request->month)
            ->where('user_id', $user->id)
            ->with(["type_absence", 'user'])
            ->get();
        return response()->json($absences);
    }

    public function GetAbsenceOfMe(Request $request)
    {
        $validator = Validator::make($request->query(), [
            'page' => 'nullable|integer|min:1',
            'selectedMonth' => 'nullable|integer|min:1|max:12',
            'selectedYear' => 'nullable|integer|min:2000',
            "Status" => "nullable|string",
            "UserId" => "nullable",
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }
        $user = User::find(Auth::id());


        $response = null;


        $page = $request->query("page", 1);
        $perPage = 4;
        $role = AccountService::getRoleById(role_id: $user->role_id);

        $query = AbsenceRequest::with(['type_absence', 'user']);

        switch ($role->role_name) {

            case RoleEnumString::Manager->value:
                $manager = Manager::where("user_id", $user->id)->first();
                if ($manager && !$request->filled("UserId")) {

                    $allIds = $manager->consultants()->pluck("user_id")->toArray();
                    // Include manager's own ID
                    $allIds[] = $user->id;
                    $query->whereIn("user_id", $allIds);
                }
                break;

            case RoleEnumString::Consultant->value:
                $user_consultant = Consultant::where("user_id", operator: $user->id)->first();
                if ($user_consultant) {
                    $query->where("user_id", Auth::id());
                }
        }
        $query->when($request->filled("selectedYear"), fn($q) => $q->whereYear("created_at", $request->selectedYear))
            ->when($request->filled("selectedMonth"), fn($q) => $q->whereMonth("created_at", $request->selectedMonth))
            ->when($request->filled("Status"), fn($q) => $q->where("status", $request->Status))
            ->when($request->filled('UserId') && $role->role_name != RoleEnumString::Consultant->value, function ($q) use ($request) {
                return $q->where('user_id', $request->UserId);
            });

        $response = $query->paginate($perPage, ['*'], 'page', $page);



        return response()->json($response);
    }


    public function GetListOfAbsenceTypes()
    {
        return response()->json(AbsenceRequestType::all());
    }

    public function updateAbsence(Request $request)
    {
        $request->validate([
            'id' => 'required|numeric',
            'status' => [Rule::enum(AbsenceRequestStatusEnum::class), "required"],
        ]);
        $absences = AbsenceRequest::find($request->id);
        if (!$absences) {
            return response()->json([
                'message' => 'not found',
            ], 404);
        }
        $absences->status = $request->status;
        $absences->save();
        return response()->json($absences);
    }
    public function GetAllAbsenceStatus()
    {
        return response()->json(["status" => AbsenceRequestStatusEnum::values()]);
    }
}
