<?php

namespace App\Enums;

enum AbsenceRequestStatusEnum: string
{
    case VALID = "VALID";
    case NOT_VALID = "NOT_VALID";
    case CANCELLED = "CANCELLED";
    case PENDING = "PENDING";
    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
