<?php

namespace App\Services;

use App\Models\Activite;
use App\Models\ClientB2B;
use App\Models\ClientEsoft;
use App\Models\ConsultantProject;
use App\Models\Facture;
use App\Models\ProjectManager;
use App\Models\TimeSheet;
use App\Models\TimeSheetLigne;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ClientB2BService
{
    public function deleteClientB2B(int $id): bool
    {
        DB::transaction(function () use ($id) {
            $clientB2B = ClientB2B::find($id);

            if (!$clientB2B) {
                throw new \Exception('B2B client not found');
            }
            $projects = $clientB2B->projects();
            // Check if the authenticated user owns this B2B client
            $user_client_esoft = ClientEsoft::find($clientB2B->client_esoft_id);
            if (!$user_client_esoft || $user_client_esoft->user_id !== Auth::id()) {
                throw new \Exception('Unauthorized');
            }
            $projects = $clientB2B->projects()->get();
            Facture::where("client_b2b_id", $clientB2B->id)->delete();
            // Delete Activite  projects
            foreach ($projects as $project) {
                ProjectManager::where('project_id', $project->id)->delete();
                ConsultantProject::where('project_id', $project->id)->delete();
                $timesheets = TimeSheet::where('project_id', $project->id)->get();
                foreach ($timesheets as $timesheet) {
                    TimeSheetLigne::where('time_sheet_id', $timesheet->id)->delete();
                }
                TimeSheet::where('project_id', $project->id)->delete();
                Activite::where('project_id', $project->id)->delete();
            }

            // Delete associated projects
            $clientB2B->projects()->delete();
            // Delete the client
            $clientB2B->delete();
        });
        return true;
    }
}
