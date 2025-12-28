<?php

namespace App\Enum;

enum JobAppEnvApplicationStatus: string
{
    case PENDING = "pending";
    case InProgress = "in-progress";
    case Done = "done";
}
