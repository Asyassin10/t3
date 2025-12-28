<?php
namespace App\Services;

class HttpDefaultExceptionMesages
{
    public function errorNotFound(): array
    {
        return [
            "msg" => "resource not foound"
        ];
    }
    public function errorResourceOwnership(): array
    {
        return [
            "msg" => "resource not yours or not found"
        ];
    }

}
