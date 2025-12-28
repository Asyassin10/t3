<?php

namespace App\Enums;

enum FactureStatus: string
{
    case PENDING = 'pending';
    case PAID = 'paid';
}
