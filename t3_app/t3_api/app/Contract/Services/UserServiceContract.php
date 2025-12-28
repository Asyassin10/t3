<?php

namespace App\Contract\Services;

use App\Models\AccountCreationRequest;
use App\Models\ClientEsoft;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

interface UserServiceContract
{
    public static function CheckOwnerShipWithExceptRole(Model $model, User $user): bool;
    public static function BasicRoleCan(string $role, array $allowed_roles);
    public function InitAccountManager(User $user): void;
    public function InitAccountClientEsoft(User $user): AccountCreationRequest;
    public function CheckAccountOwnerShipFromClientEsoftToManager(User $manager, ClientEsoft $client_esoft): bool;
    public function GetClientEsoftOfUser(User $user): ClientEsoft | null;
    public function InitClientEsoft(string $data_str): void;
    public static function getRoleById(int $role_id);
}
