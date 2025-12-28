<?php

namespace App\Enums;

enum ModuleEnum: string
{
    case CRA = "CRA";
    case ECRA = "ECRA";
    case ABS = "ABS";
    case EABS = "EABS";
    case GFACT = "GFACT";
    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
