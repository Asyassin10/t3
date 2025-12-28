<?php

namespace App\Enums;

enum ProjectStatusEnum: string
{
    case Pending = "PENDING";
    case VALID = "VALID";
    case NOT_VALID = "NOT_VALID";
    case InProgress = "InProgress";

    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
