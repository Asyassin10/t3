<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubscriptionPlanResource\Pages;
use App\Models\SubscriptionPlan;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SubscriptionPlanResource extends Resource
{
    protected static ?string $model = SubscriptionPlan::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationLabel = 'Subscription Plans';

    protected static ?string $navigationGroup = 'Subscription Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('subscription_plan_name')
                    ->required()
                    ->maxLength(255)
                    ->label('Plan Name'),
                Forms\Components\TextInput::make('identifier')
                    ->required()
                    ->maxLength(255)
                    ->label('Identifier')
                    ->helperText('Unique identifier for this plan (e.g., basic_monthly)'),
                Forms\Components\TextInput::make('stripe_id')
                    ->maxLength(255)
                    ->label('Stripe Price ID')
                    ->helperText('The Stripe price ID (price_xxxxx)'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->sortable(),
                Tables\Columns\TextColumn::make('subscription_plan_name')
                    ->searchable()
                    ->label('Plan Name'),
                Tables\Columns\TextColumn::make('identifier')
                    ->searchable()
                    ->label('Identifier'),
                Tables\Columns\TextColumn::make('stripe_id')
                    ->searchable()
                    ->label('Stripe Price ID'),
                Tables\Columns\TextColumn::make('modules_count')
                    ->counts('modules')
                    ->label('Modules'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
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
            'index' => Pages\ListSubscriptionPlans::route('/'),
            'create' => Pages\CreateSubscriptionPlan::route('/create'),
            'edit' => Pages\EditSubscriptionPlan::route('/{record}/edit'),
        ];
    }
}
