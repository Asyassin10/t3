<?php

namespace App\Services;

use App\Enums\RoleEnumString;
use App\Models\AppCommercialData;
use App\Models\ClientB2B;
use App\Models\Consultant;
use App\Models\ConsultantProject;
use App\Models\Facture;
use App\Models\Manager;
use App\Models\PaymentFacture;
use App\Models\Project;
use App\Models\ProjectManager;
use App\Models\TimeSheet;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use illuminate\Support\Str;

class FactureService
{
    public static function getFatureData(int $year, int $month, ClientB2B $clientB2B, Facture $facture): array
    {
        $app_data = [];
        $projects_of_client = Project::where("client_b2b_id", $clientB2B->id)->get();
        /* $project = Project::with('concultants')->find($project_id);
        $consultants = collect($project->concultants)->pluck("user_id"); */
        $data = TimeSheet::whereYear("created_at", $year)
            ->whereMonth("created_at", $month)
            ->whereIn("project_id", $projects_of_client->pluck("id"))
            ->whereHas("user.role", function ($query) {
                $query->whereIn("role_name", [RoleEnumString::Manager->value, RoleEnumString::Consultant->value]);
            })
            ->whereHas('cra', function ($query) {
                $query->where('status', 'VALIDATED');
            })
            ->with(["project", "user", "activite"])
            ->get();

        $total = 0;
        foreach ($data as $d) {
            $role = AccountService::getRoleById(role_id: $d->user->role_id);

            if ($role->role_name == RoleEnumString::Consultant->value) {
                $consultant = Consultant::where("user_id", $d->user->id)->first();
                $consultant_project = ConsultantProject::where("project_id", $d->project->id)
                    ->where("consultant_id", $consultant->id)
                    ->first();
                if ($consultant_project) {
                    $price_total = $d->count_of_days * $consultant_project->price_per_day;
                    $d->user["price_total"] = $price_total;
                    $d->user["price_per_day"] = $consultant_project->price_per_day;
                    $d->user["role_name"] = $d->user->role->role_name;
                    $total += $price_total;
                }
            }
            if ($role->role_name == RoleEnumString::Manager->value) {
                $manager = Manager::where('user_id', $d->user->id)->first();

                $manager_project = ProjectManager::where("project_id", $d->project->id)
                    ->where("manager_id", $manager->id)
                    ->first();
                if ($manager_project) {
                    $total += $d->count_of_days * $manager_project->project_manager_price_per_day;
                    $d->user["price_per_day"] = $manager_project->project_manager_price_per_day;
                    $d->user["price_total"] = $d->count_of_days * $manager_project->project_manager_price_per_day;
                    $d->user["role_name"] = $d->user->role->role_name;
                }
            }
        }
        $tvaRate = 0.20; // 20% TVA

        $app_data["total"] = $total;
        $app_data["total_tva"] = $total * $tvaRate;
        $app_data["total_with_tva"] = $total + $app_data["total_tva"];

        $app_data["data"] = $data;
        $app_data["facture"] = $facture;
        $app_data["client_esoft_commercial_data"] = AppCommercialData::all();
        $app_data["client_commercial_data"] = $clientB2B->commercialData;
        $app_data["projects_of_client"] = $projects_of_client;
        $app_data["clientB2B"] = $clientB2B;
        $app_data["payments"] = PaymentFacture::where("facture_id", $facture->id)->get();
        return $app_data;
    }
    public static function generatePdfOfData(array $data): string
    {

        $pdf = Pdf::loadView('factures.templateFacture', ['facture' => $data]);

        $filePath = 'pdfs/' . time() . Str::random(12) . '.pdf';
        $fullPath = public_path($filePath);

        // S'assurer que le répertoire existe
        if (!file_exists(dirname($fullPath))) {
            mkdir(dirname($fullPath), 0755, true);
        }

        // Enregistrer le PDF à l'emplacement spécifié
        file_put_contents($fullPath, $pdf->output());
        return asset($filePath);
    }

    public static function extractFileNameFromUrl(string $url): string
    {
        // Extract the file name from the URL using basename
        return basename(parse_url($url, PHP_URL_PATH));
    }

    public static function DeletePdfGenerated(string $url)
    {
        // Extract the file path from the URL
        /* $filePath = str_replace(asset(''), '', $url);
        $fullPath = public_path($filePath); */
        $filePath = static::extractFileNameFromUrl($url);
        //return
        $fullPath = public_path() . "" . "/pdfs/" . $filePath;

        // Check if the file exists and delete it
        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }
        // Return false if the file does not exist
        return false;
    }
}
