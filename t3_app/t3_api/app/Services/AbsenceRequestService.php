<?php

namespace App\Services;

use App\Enums\RoleEnumString;
use App\Models\AbsenceRequest;
use App\Models\User;

class AbsenceRequestService
{
    //  check if user can interact with the AbsenceRequest object
    // roles => manager can't validate or not validating he's own AbsenceRequest
    public function checkAbsenceRequestOwnership(AbsenceRequest $absenceRequest, User $user): bool
    {
        $role = AccountService::getRoleById(role_id: $user->role_id);

        if ($role->role_name == RoleEnumString::Manager->value) {
            if ($absenceRequest->user_id == $user->id) {
                return false;
            }
        }
        return true;
    }
}
