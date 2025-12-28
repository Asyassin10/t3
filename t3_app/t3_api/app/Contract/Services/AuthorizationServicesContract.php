<?php

namespace App\Contract\Services;

use App\Models\Permission;
use App\Models\User;

interface AuthorizationServicesContract  {
    public function CheckIfUserCanDoAction(User $user,Permission $permission):bool;
}
