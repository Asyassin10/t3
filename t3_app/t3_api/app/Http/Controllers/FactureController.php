<?php

namespace App\Http\Controllers;

use App\Enums\FactureStatus;
use App\Enums\RoleEnumString;
use App\Models\ClientB2B;
use App\Models\ConsultantProject;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Models\Facture;
use App\Models\Project;
use App\Models\User;
use App\Services\AccountService;
use App\Services\ExceptionMessagesService;
use App\Services\FactureService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use ZipArchive;

class FactureController extends Controller
{
    public function GetFactures(Request $request): JsonResponse
    {
        $validator = Validator::make($request->query(), [
            "page" => "nullable|integer|min:1",
            "value" => "nullable|max:255",
        ]);
        if ($validator->fails()) {
            return response()->json(
                [
                    "errors" => $validator->errors(),
                ],
                422,
            );
        }
        $perPage = 4;

        $user = User::find(Auth::id());
        $role = AccountService::getRoleById(role_id: $user->role_id);
        $page = $request->query("page");
        // add when to selectedMonth and selectedYear and clientB2b
        $factures = Facture::query()
            ->when($request->filled("selectedMonth"), function ($q) use (
                $request,
            ) {
                $q->whereMonth(
                    "created_at",
                    $request->query("selectedMonth"),
                );
            })
            ->when($request->filled("selectedYear"), function ($q) use (
                $request,
            ) {
                $q->whereYear(
                    "created_at",
                    $request->query("selectedYear"),
                );
            })
            ->when($request->filled("clientB2b"), function ($q) use (
                $request,
            ) {
                $q->where("client_b2b_id", $request->query("clientB2b"));
            })
            ->paginate($perPage, ["*"], "page", $page);
        return response()->json($factures);
    }

    public function saveFacture(Request $request)
    {
        $request->validate([
            "year" => "required|numeric",
            "month" => "required|numeric",
            "project_id" => "required|numeric",
        ]);
        $projet = Project::find($request->integer("project_id"));
        $client_b2b = ClientB2B::find($projet->client_b2b_id);

        // Validation et traitement des données de la facture ici
        $facture = Facture::whereYear("created_at", $request->year)
            ->whereMonth("created_at", $request->month)
            ->first();

        if (!$facture) {
            //   $numeroFacture = Carbon::now()->format('Ymd') . Str::random(4);
            //$nombreConsultant = $request->input('nombre_consultant', 4);
            $dateFacture = Carbon::now();
            $facture = Facture::create([
                "numero_facture" => Str::random(12),
                "year" => $request->input("year"),
                "month" => $request->input("month"),
                "date_facture" => $dateFacture,
                "nombre_consultant" => ConsultantProject::where(
                    "project_id",
                    $projet->id,
                )->count(),
                "facture_path" => "---",
                "client_b2b_id" => $projet->client_b2b_id,
            ]);
        }
        $data_app = FactureService::getFatureData(
            $request->year,
            $request->month,
            $client_b2b,
            $facture,
        );
        $full_path = FactureService::generatePdfOfData($data_app);
        $facture->update([
            "facture_path" => $full_path,
        ]);
        return response()->json([
            "facture" => $facture,
            "full_path" => $full_path,
        ]);
    }
    public function saveFacturesOfClient(Request $request)
    {
        $request->validate([
            "year" => "required|numeric",
            "month" => "required|numeric",
            "client_id" => "required|numeric",
        ]);
        $client_b2b = ClientB2B::find($request->client_id);
        $projets = Project::where(
            column: "client_b2b_id",
            operator: $client_b2b->id,
        )->get();
        $pdfPaths = [];
        if (count($projets) == 0) {
            return response()->json(["message" => "no_projects"], 500);
        }
        foreach ($projets as $projet) {
            $facture = Facture::whereYear("created_at", $request->year)
                ->whereMonth("created_at", $request->month)
                ->first();

            if (!$facture) {
                $dateFacture = Carbon::now();
                $facture = Facture::create([
                    "numero_facture" => Str::random(12),
                    "year" => $request->input("year"),
                    "month" => $request->input("month"),
                    "date_facture" => $dateFacture,
                    "nombre_consultant" => ConsultantProject::where(
                        "project_id",
                        $projet->id,
                    )->count(),
                    "facture_path" => "---",
                    // 'facture_path' => $full_path,
                    "client_b2b_id" => $projet->client_b2b_id,
                ]);
            }
            $data_app = FactureService::getFatureData(
                $request->year,
                $request->month,
                $client_b2b,
                $facture,
            );
            $full_path = FactureService::generatePdfOfData($data_app);
            $pdfPaths[] = $full_path;
            $facture->update([
                "facture_path" => $full_path,
            ]);
        }

        $zipFileName = "invoices_" . time() . ".zip";

        // store zip in public/exports/
        $publicFolder = public_path("exports");

        if (!file_exists($publicFolder)) {
            mkdir($publicFolder, 0777, true);
        }

        $zipFullPath = $publicFolder . "/" . $zipFileName;

        $zip = new ZipArchive();

        if ($zip->open($zipFullPath, ZipArchive::CREATE) === true) {
            Log::info(message: json_encode(value: $pdfPaths));
            foreach ($pdfPaths as $url) {
                // Convert URL to relative path
                $relative = str_replace(url("/"), "", $url); // "/pdfs/xxx.pdf"

                // Fix leading slash (IMPORTANT)
                $relative = ltrim($relative, "/");

                // Convert to absolute path
                $absolutePath = public_path($relative);

                Log::info("ADDING TO ZIP:", [
                    "url" => $url,
                    "relative" => $relative,
                    "absolute" => $absolutePath,
                    "exists" => file_exists($absolutePath),
                ]);

                if (file_exists($absolutePath)) {
                    $zip->addFile($absolutePath, basename($absolutePath));
                } else {
                }
            }

            $zip->close();
        } else {
            return response()->json(["error" => "Failed to create ZIP"], 500);
        }

        // public URL for the browser
        $publicUrl = asset("exports/" . $zipFileName);

        return response()->json([
            "client" => $client_b2b,
            "full_path" => $publicUrl,
        ]);
    }
    public function MakeFacturePaid(Request $request)
    {
        $request->validate([
            "facture_id" => "required|numeric",
        ]);
        $facture = Facture::find($request->facture_id);
        if (!$facture) {
            return response()->json(["msg" => "facture not found"], 404);
        }
        $facture->status = FactureStatus::PAID->value;
        $facture->paid_at = now(); // set paid_at to current timestamp
        $facture->save();
        return response()->json($facture->refresh());
    }
    public function setNote(Request $request)
    {
        $request->validate([
            "facture_id" => "required|numeric",
            "note" => "required|string|max:500",
        ]);
        $facture = Facture::find($request->facture_id);
        if (!$facture) {
            return response()->json(["msg" => "facture not found"], 404);
        }
        $facture->note = $request->string("note");
        $facture->save();
        return response()->json($facture->refresh());
    }
    public function generatePdf(Request $request)
    {
        $request->validate([
            "year" => "required|numeric",
            "month" => "required|numeric",
            "facture_id" => "required|numeric",
        ]);
        $facture = Facture::find($request->facture_id);
        if (!$facture) {
            return response()->json(["msg" => "facture not found"], 404);
        }
        $client_b2b = ClientB2B::find($facture->client_b2b_id);

        $data_app = FactureService::getFatureData(
            $request->year,
            $request->month,
            $client_b2b,
            $facture,
        );
        Log::info("DATA APP" . json_encode($data_app));

        $full_path = FactureService::generatePdfOfData($data_app);
        return response()->json([
            "facture" => $facture,
            "full_path" => $full_path,
        ]);
    }
    public function deletePdf(Request $request)
    {
        $request->validate([
            "app_url" => "required|url",
        ]);
        return response()->json([
            "ok" => FactureService::DeletePdfGenerated($request->app_url),
        ]);
    }
}
