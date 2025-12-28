<?php
namespace App\Services;

use App\Contract\Services\AuthorizationServicesContract;
use App\Models\Permission;
use App\Models\User;

class AuthorizationService implements AuthorizationServicesContract{

    public function CheckIfUserCanDoAction(User $user,Permission $permission) : bool{
        return true;
    }

}
