<?php

namespace App\Http\Requests\Activities;

use App\Enums\RoleEnumString;
use App\Models\User;
use App\Services\AccountService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CreateActivityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = User::find(Auth::id());
        $role = AccountService::getRoleById(role_id: $user->role_id);
        return AccountService::BasicRoleCan(
            role: $role->role_name,
            allowed_roles: [
                RoleEnumString::ClientEsoft->value,
                RoleEnumString::Manager->value,
                RoleEnumString::Consultant->value,
            ]
        );
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "project_id" => "required|numeric",
            "activity_name" => "required|string|max:255",
        ];
    }
}
