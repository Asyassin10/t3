<?php

namespace App\Http\Controllers\Api;

use App\Enums\CraStatusEnum;
use App\Enums\RoleEnumString;
use App\Http\Controllers\Controller;
use App\Models\ClientEsoft;
use App\Models\Consultant;
use App\Models\CRA;
use App\Models\Manager;
use App\Models\Project;
use App\Models\TimeSheet;
use App\Models\TimeSheetLigne;
use App\Models\User;
use App\Services\AccountService;
use App\Services\ExceptionMessagesService;
use App\Services\HttpDefaultExceptionMesages;
use App\Services\HttpResponseBuilderSevice;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class TimeTrackingController extends Controller
{
    private $httpResponseBuilder;
    private $httpDefaultExceptionMesages;
    private $accountService;


    public function __construct(
        HttpResponseBuilderSevice $httpResponseBuilder,
        AccountService $accountService,
        HttpDefaultExceptionMesages $httpDefaultExceptionMesages
    ) {
        $this->httpResponseBuilder = $httpResponseBuilder;
        $this->httpDefaultExceptionMesages = $httpDefaultExceptionMesages;
        $this->accountService = $accountService;
    }
    public function CreateTimeLigne(Request $request)
    {
        $request->validate([
            "project_id" => "required|numeric",
            "activite_id" => "required|numeric",
            'ids_of_days' => 'required|array',
            'ids_of_days.*' => 'required|integer',
            "count_of_days" => "required|numeric",
            "ligne_date" => "required|date_format:Y-m-d",
            'times' => 'required|array',
            'times.*.value' => 'nullable|string',
            'times.*.is_week_end' => 'required|boolean',
            'times.*.is_disabled' => 'required|boolean',
            'times.*.rest_acceptable' => 'required|numeric',
            'times.*.app_id' => 'required|numeric',
        ]);

        $current_time = Carbon::now();
        $cra = CRA::whereYear("created_at", $current_time->year)
            ->whereMonth("created_at", $current_time->month)
            ->where("user_id", Auth::id())
            ->first();

        $cra->refresh();

        $time_sheet = TimeSheet::create([
            "project_id" => $request->project_id,
            "activite_id" => $request->activite_id,
            "ids_of_days" => implode(',', $request->ids_of_days),
            "count_of_days" => $request->count_of_days,
            "date" => $request->ligne_date,
            "user_id" => Auth::id(),
            "cra_id" => $cra->id,
        ]);
        $time_sheet->refresh();
        foreach ($request->times as $time) {
            TimeSheetLigne::create([
                "value" => $time["value"],
                "is_week_end" => $time["is_week_end"],
                "is_disabled" => $time["is_disabled"],
                "rest_acceptable" => $time["rest_acceptable"],
                "app_id" => $time["app_id"],
                "time_sheet_id" => $time_sheet->id,
            ]);
        }
        $time_sheet->load(["cra", "activite", "time_sheet_ligne", "project"]);
        return response()->json($time_sheet);
    }
    public function DeleteTimeLigne(Request $request)
    {
        $request->validate([
            "time_ligne_id" => "required|numeric",
        ]);
        $time_sheet = TimeSheet::where("id", $request->time_ligne_id)->with(["time_sheet_ligne"])->first();
        // delete time_sheet
        if (!$time_sheet) {
            return response()->json(["message" => "Time sheet not found"], 404);
        }

        foreach ($time_sheet->time_sheet_ligne as $time_sheet_ligne) {
            $time_sheet_ligne->delete();
        }

        // Delete the time_sheet record
        $time_sheet->delete();
        return response()->json(["message" => "Time sheet deleted successfully"]);
    }
    public function getTimeSheetOfUserBasedOnDate(Request $request)
    {
        $request->validate([
            "year" => "required|numeric",
            "month" => "required|numeric",
            'id' => 'required|numeric',
        ]);
        // Assuming you want to filter data based on both year and month
        $cra = CRA::find($request->id);
        if (!$cra) {
            return response()->json([
                'msg' => 'not found',
            ]);
        }
        $data = TimeSheet::whereYear("date", $request->year)
            ->whereMonth("date", $request->month)
            ->where('user_id', $cra->user->id)
            ->with(["cra", "activite", "time_sheet_ligne", "project"])
            ->get();
        return response()->json($data);
    }


    public function getCrasOfMe(Request $request): JsonResponse
    {

        $validator = Validator::make($request->query(), [
            'page' => 'nullable|integer|min:1',
            'selectedMonth' => 'nullable|integer|min:1|max:12',
            'selectedYear' => 'nullable|integer|min:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }
        $response = null;
        $page = $request->query('page', 1); // default page = 1
        $selectedMonth = $request->query('selectedMonth');
        $selectedYear = $request->query('selectedYear');

        $perPage = 4;
        $user = User::find(Auth::id());
        $role = AccountService::getRoleById(role_id: $user->role_id);
        switch ($role->role_name) {
            case RoleEnumString::Manager->value:
                $manager = Manager::where("user_id", $user->id)->first();
                if (!$manager) {
                    return response()->json(ExceptionMessagesService::errorUserNotFound(), 404);
                }

                $consultantIds = Project::where('manager_id', $manager->id)
                    ->with('consultants')
                    ->get()
                    ->flatMap(fn($project) => $project->consultants->pluck('user_id'))
                    ->add(Auth::id());
                // Consultant CRAs
                $consultantCras = CRA::whereIn('user_id', $consultantIds)
                    ->with('user');


                if ($selectedYear) {
                    $consultantCras->whereYear("created_at", $selectedYear);
                    /*    $cras->whereYear("created_at", $selectedYear); */
                }

                if ($selectedMonth) {
                    $consultantCras->whereMonth("created_at", $selectedMonth);
                    /*  $cras->whereMonth("created_at", $selectedMonth); */
                }
                $response = $consultantCras->paginate($perPage, ['*'], 'page', $page)->toArray();
                break;

            case RoleEnumString::ClientEsoft->value:
                Log::info("user is : " . json_encode($user));
                $user_client_esoft = ClientEsoft::where("user_id", $user->id)->first();
                if (!$user_client_esoft) {
                    return response()->json(ExceptionMessagesService::errorUserNotFound(), 404);
                }
                Log::info("clientesoft is  is : " . json_encode($user_client_esoft));
                $managerIds = Manager::where('client_esoft_id', $user_client_esoft->id)->get()->pluck('user_id');
                $concultantsIds = Consultant::where('client_esoft_id', $user_client_esoft->id)->get()->pluck('user_id');
                $cras = CRA::whereIN("user_id", array_merge($managerIds->toArray(), $concultantsIds->toArray()))->orWhere("user_id", Auth::id())->with(["user"]);
                if ($selectedYear) {
                    $cras->whereYear("created_at", $selectedYear);
                }
                if ($selectedMonth) {
                    $cras->whereMonth("created_at", $selectedMonth);
                }
                $response = $cras->paginate($perPage, ['*'], 'page', $page);
                break;
            case RoleEnumString::Consultant->value:
                $user_consultant = Consultant::where("user_id", $user->id)->first();
                if (!$user_consultant) {
                    return response()->json(ExceptionMessagesService::errorUserNotFound(), 404);
                }
                $cras = CRA::where("user_id", Auth::id())->with(["user"]);
                if ($selectedYear) {
                    $cras->whereYear("created_at", $selectedYear);
                }
                if ($selectedMonth) {
                    $cras->whereMonth("created_at", $selectedMonth);
                }
                $response = $cras->paginate($perPage, ['*'], 'page', $page);
                break;
        }


        return response()->json(data: $response);
    }

    public function initCra()
    {

        $cra = CRA::create([
            "user_id" => Auth::id(),
            "status" => CraStatusEnum::NOT_SENT_TO_VALIDATION_YET->value,
            "number_of_days_filled" => 0,
            "progress" => 0,
        ]);
        return response()->json($cra);
    }
    public function UpdateNumbersDaysOfCra(Request $request)
    {
        $request->validate([
            "number_of_days_filled" => "nullable|numeric",
            "number_of_days_available" => "nullable|numeric",
            "progress" => "nullable|numeric",
            "cra_id" => "required|numeric",
        ]);
        $cra = CRA::find($request->cra_id);
        if (!$cra) {
            return $this->httpResponseBuilder->buildJsonResponse($this->httpDefaultExceptionMesages->errorNotFound(), 404);
        }
        if ($request->has('number_of_days_filled') && !is_null($request->number_of_days_filled)) {
            $cra->number_of_days_filled = $request->number_of_days_filled;
        }
        if ($request->has('number_of_days_available') && !is_null($request->number_of_days_available)) {
            $cra->number_of_days_available = $request->number_of_days_available;
        }
        if ($request->has('progress') && !is_null($request->progress)) {
            $cra->progress = $request->progress;
        }
        $cra->save();
        return $this->httpResponseBuilder->buildJsonResponse(['message' => 'CRA updated successfully.'], 200);
    }

    public function doasItHqveCraForTheCurrentTime()
    {
        $currentYear = Carbon::now()->year;
        $currentMonth = Carbon::now()->month;


        $data = CRA::whereYear("created_at", $currentYear)
            ->whereMonth("created_at", $currentMonth)
            ->where('user_id', Auth::id())
            ->get();
        if (count($data) == 0) {
            return response()->json(['state' => false]);
        }
        return response()->json(['state' => true]);
    }
    public function getCra($id)
    {
        // Validate the route parameter
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }
        $cra = CRA::find($id);
        if (!$cra) {
            return response()->json([
                'msg' => 'not found',
            ]);
        }
        return response()->json($cra);
    }
    public function UpdateCommentOfTimeLigne(Request $request)
    {
        $request->validate([
            "time_ligne" => "required|numeric",
            "comment" => "required|string",
        ]);
        $time_ligne = TimeSheet::find($request->time_ligne);
        if (!$time_ligne) {
            return response()->json(["msg" => "time_ligne is not found"]);
        }
        $time_ligne->comment = $request->comment;
        $time_ligne->save();
        return response()->json($time_ligne);
    }
    public function SendCraToValidation()
    {
        $current_time = Carbon::now();
        $cra = CRA::whereYear("created_at", $current_time->year)
            ->whereMonth("created_at", $current_time->month)
            ->where("user_id", Auth::id())
            ->first();
        $cra->status = CraStatusEnum::WAITING_TO_VALIDATION->value;
        $cra->save();


        return response()->json($cra);
    }
    public function UndoSendCraToValidation()
    {
        $current_time = Carbon::now();
        $cra = CRA::whereYear("created_at", $current_time->year)
            ->whereMonth("created_at", $current_time->month)
            ->where("user_id", Auth::id())
            ->first();
        $cra->status = CraStatusEnum::NOT_SENT_TO_VALIDATION_YET->value;
        $cra->save();
        return response()->json($cra);
    }
    public function ValidateCra(Request $request)
    {
        $request->validate([
            'id' => 'required|numeric',
        ]);
        $cra = CRA::find($request->id);
        if (!$cra) {
            return response()->json([
                'msg' => 'not found',
            ]);
        }
        $cra->status = CraStatusEnum::VALIDATED->value;
        $cra->save();
        return response()->json($cra);
    }
}
