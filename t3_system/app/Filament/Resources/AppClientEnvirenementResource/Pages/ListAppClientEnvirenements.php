<?php

namespace App\Filament\Resources\AppClientEnvirenementResource\Pages;

use App\Filament\Resources\AppClientEnvirenementResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListAppClientEnvirenements extends ListRecords
{
    protected static string $resource = AppClientEnvirenementResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
