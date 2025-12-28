<?php

namespace App\Http\Responses;

class ResponseUnauthorized
{
    public static function toJson()
    {
        return response()->json(["msg" => "not authorized action"], 401);
    }
}
