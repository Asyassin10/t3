<?php

namespace App\Services;

class ExceptionMessagesService
{
    public static function ownerShipException(): array
    {
        return ["msg" => "The resource that you are trying to update is not yours"];
    }
    public static function errorUserNotFound(): array
    {
        return ["msg" => "user not found"];
    }
    public static function errorInvalidRole(): array
    {
        return ["msg" => "invalid role"];
    }
    public static function ResourceNotFound(string $resource): array
    {
        return ["msg" => "{$resource} not found"];
    }
}
