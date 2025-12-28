<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AppClientEnvirenementResource\Pages;
use App\Models\AppClientEnvirenement;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Notifications\Notification;

class AppClientEnvirenementResource extends Resource
{
    protected static ?string $model = AppClientEnvirenement::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationLabel = 'Client Accounts';

    protected static ?string $navigationGroup = 'Subscription Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('email')
                    ->email()
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Toggle::make('paye')
                    ->label('Paid Status')
                    ->required(),
                Forms\Components\Toggle::make('is_active')
                    ->label('Account Active')
                    ->default(true)
                    ->required(),
                Forms\Components\TextInput::make('app_api_key')
                    ->required()
                    ->maxLength(255)
                    ->label('API Key'),
                Forms\Components\DatePicker::make('user_subscriptionplan_date_start')
                    ->required()
                    ->label('Subscription Start Date'),
                Forms\Components\DatePicker::make('user_subscriptionplan_date_end')
                    ->required()
                    ->label('Subscription End Date'),
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'active' => 'Active',
                        'inactive' => 'Inactive',
                        'suspended' => 'Suspended',
                    ])
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\IconColumn::make('paye')
                    ->boolean()
                    ->label('Paid')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active')
                    ->sortable(),
                Tables\Columns\TextColumn::make('app_api_key')
                    ->label('API Key')
                    ->searchable()
                    ->copyable()
                    ->copyMessage('API key copied')
                    ->tooltip('Click to copy'),
                Tables\Columns\TextColumn::make('user_subscriptionplan_date_start')
                    ->date()
                    ->label('Start Date')
                    ->sortable(),
                Tables\Columns\TextColumn::make('user_subscriptionplan_date_end')
                    ->date()
                    ->label('End Date')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'active' => 'success',
                        'pending' => 'warning',
                        'inactive' => 'danger',
                        'suspended' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('paye')
                    ->label('Paid Status')
                    ->boolean()
                    ->trueLabel('Paid')
                    ->falseLabel('Unpaid')
                    ->native(false),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Account Status')
                    ->boolean()
                    ->trueLabel('Active')
                    ->falseLabel('Deactivated')
                    ->native(false),
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'active' => 'Active',
                        'inactive' => 'Inactive',
                        'suspended' => 'Suspended',
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('toggle_active')
                    ->label(fn (AppClientEnvirenement $record): string =>
                        $record->is_active ? 'Deactivate' : 'Activate'
                    )
                    ->icon(fn (AppClientEnvirenement $record): string =>
                        $record->is_active ? 'heroicon-o-x-circle' : 'heroicon-o-check-circle'
                    )
                    ->color(fn (AppClientEnvirenement $record): string =>
                        $record->is_active ? 'danger' : 'success'
                    )
                    ->requiresConfirmation()
                    ->action(function (AppClientEnvirenement $record) {
                        $record->is_active = !$record->is_active;
                        $record->save();

                        Notification::make()
                            ->title($record->is_active ? 'Account activated' : 'Account deactivated')
                            ->success()
                            ->send();
                    }),
                Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('activate')
                        ->label('Activate selected')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(function ($records) {
                            $records->each(fn ($record) => $record->update(['is_active' => true]));
                            Notification::make()
                                ->title('Accounts activated')
                                ->success()
                                ->send();
                        }),
                    Tables\Actions\BulkAction::make('deactivate')
                        ->label('Deactivate selected')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->action(function ($records) {
                            $records->each(fn ($record) => $record->update(['is_active' => false]));
                            Notification::make()
                                ->title('Accounts deactivated')
                                ->success()
                                ->send();
                        }),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAppClientEnvirenements::route('/'),
            'create' => Pages\CreateAppClientEnvirenement::route('/create'),
            'edit' => Pages\EditAppClientEnvirenement::route('/{record}/edit'),
        ];
    }
}
