<?php

namespace App\Services;

use App\Contract\Services\UserServiceContract;
use App\Enums\RoleEnum;
use App\Enums\RoleEnumString;
use App\Models\AccountCreationRequest;
use App\Models\AssignedModules;
use App\Models\ClientEsoft;
use App\Models\Consultant;
use App\Models\Manager;
use App\Models\Module;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AccountService implements UserServiceContract
{

    public function getAssignedUsersOfMe(User $user, Role $role)
    {
        if ($role->role_name == RoleEnumString::Manager) {
        }
    }
    public static function CheckOwnerShipWithExceptRole(Model $model, User $user): bool
    {
        if ($user->role->role_name === RoleEnumString::ClientEsoft->value) {
            return true;
        }

        if (isset($model->user_id) && $model->user_id === $user->id) {
            return true;
        }

        return false;
    }

    public static function BasicRoleCan(string $role, array $allowed_roles)
    {
        return in_array($role, $allowed_roles, true);
    }
    public static function getRoleById(int $role_id): Role
    {
        return Role::find(id: $role_id);
    }
    public static function getRoleByName(string $role_name): Role
    {
        return Role::where(column: "role_name", operator: $role_name)->first();
    }
    public function InitClientEsoft(string $data_str): void
    {
        $data = json_decode($data_str);
        /* echo $data->email; */
        $dataArray = (array) $data;

        try {
            //Validated
            $validateUser = Validator::make(
                $dataArray,
                [
                    'name' => 'required',
                    'email' => 'required|email',
                    'password' => 'required',
                ]
            );

            $role = AccountService::getRoleByName(role_name: RoleEnumString::ClientEsoft->value);

            $user = User::firstOrCreate(
                [
                    'email' => $dataArray["email"],
                ],
                [
                    'name' => $dataArray["name"],
                    'email' => $dataArray["email"],
                    "role_id" => $role->id,
                    'password' => Hash::make($dataArray["password"]),
                    'app_api_key' => $dataArray["app_api_key"],
                ]
            );
            $user->refresh()->load("role");
            // Carbon::parse($dataArray["user_subscriptionplan_date_start"])->format('Y-m-d H:i:s');
            Log::info($dataArray["user_subscriptionplan_date_start"]);
            ClientEsoft::firstOrCreate(
                [
                    'user_id' => $user->id,
                ],
                [
                    "user_id" => $user->id,
                    "app_api_key" => $dataArray["app_api_key"],
                    "user_subscriptionplan_date_start" => Carbon::parse($dataArray["user_subscriptionplan_date_start"])->format('Y-m-d'),
                    "user_subscriptionplan_date_end" => Carbon::parse($dataArray["user_subscriptionplan_date_end"])->format('Y-m-d'),
                ]
            );

            $modulesArray = $dataArray['modules'] = array_map('get_object_vars', $dataArray['modules']);

            foreach ($modulesArray as $moduleData) {
                Module::updateOrCreate(
                    ['module_name' => $moduleData['module_name']],
                    [
                        'module_name' => $moduleData['module_name'],
                        'full_name' => $moduleData['full_name'],
                        'description' => $moduleData['description'],
                    ]
                );
                AssignedModules::firstOrCreate(
                    ['assigned_module_name' => $moduleData['module_name']]
                );
            }
        } catch (\Throwable $th) {
            // handle exception
            echo "Error :   " . $th->getMessage();
        }
    }

    public function GetClientEsoftOfUser(User $user): ClientEsoft|null
    {
        return ClientEsoft::first();
        /*   $role = AccountService::getRoleById(role_id: $user->role_id);

        if ($role->role_name == RoleEnumString::ClientEsoft->value) {
            return ClientEsoft::where("user_id", $user->id)->first();
        }
        if ($role->role_name == RoleEnumString::Manager->value) {
            $user_manager = Manager::where("user_id", $user->id)->first();
            if (!$user_manager) {
                return null;
            }
            return ClientEsoft::where("id", $user_manager->client_esoft_id)->first();
        }
        if ($role->role_name == RoleEnumString::Consultant->value) {
            $user_consultant = Consultant::where("user_id", $user->id)->first();
            if (!$user_consultant) {
                return null;
            }
            return ClientEsoft::where("id", $user_consultant->client_esoft_id)->first();
        }
        return null; */
    }
    public function InitAccountManager(User $user): void
    {
        if ($user->role->role_id == RoleEnum::Manager->value) {
            // create manager entity

        }
    }
    public function InitAccountClientEsoft(User $user): AccountCreationRequest
    {
        return AccountCreationRequest::create([
            "is_valid" => false,
            "token" => str::random(60),
            "user_id" => $user->id,
        ]);
    }
    public function CheckAccountOwnerShipFromClientEsoftToManager(User $manager, ClientEsoft $client_esoft): bool
    {
        if (
            Manager::where("client_esoft_id", $client_esoft->id)
            ->where("user_id", $manager->id)
            ->exists()
        ) {
            return true;
        }

        return false;
    }
}
