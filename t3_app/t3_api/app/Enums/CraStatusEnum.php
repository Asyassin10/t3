<?php

namespace App\Enums;

enum CraStatusEnum: string
{
    case WAITING_TO_VALIDATION = "WAITING_TO_VALIDATION";
    case VALIDATED = "VALIDATED";
    case NOT_SENT_TO_VALIDATION_YET = "NOT_SENT_TO_VALIDATION_YET";
}
