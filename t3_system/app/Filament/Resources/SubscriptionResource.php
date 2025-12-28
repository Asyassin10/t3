<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubscriptionResource\Pages;
use Laravel\Cashier\Subscription;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SubscriptionResource extends Resource
{
    protected static ?string $model = Subscription::class;

    protected static ?string $navigationIcon = 'heroicon-o-credit-card';

    protected static ?string $navigationLabel = 'Stripe Subscriptions';

    protected static ?string $navigationGroup = 'Subscription Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('stripe_id')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('stripe_status')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('stripe_price')
                    ->maxLength(255),
                Forms\Components\DateTimePicker::make('trial_ends_at'),
                Forms\Components\DateTimePicker::make('ends_at'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.email')
                    ->label('User Email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('User Name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Subscription Type')
                    ->searchable(),
                Tables\Columns\TextColumn::make('stripe_id')
                    ->label('Stripe ID')
                    ->searchable()
                    ->copyable()
                    ->copyMessage('Stripe ID copied'),
                Tables\Columns\TextColumn::make('stripe_status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'active' => 'success',
                        'trialing' => 'info',
                        'past_due' => 'warning',
                        'canceled', 'incomplete', 'incomplete_expired', 'unpaid' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('stripe_price')
                    ->label('Price ID')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('quantity')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('trial_ends_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('ends_at')
                    ->label('Ends At')
                    ->dateTime()
                    ->sortable()
                    ->placeholder('Active'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: false),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('stripe_status')
                    ->label('Status')
                    ->options([
                        'active' => 'Active',
                        'trialing' => 'Trialing',
                        'past_due' => 'Past Due',
                        'canceled' => 'Canceled',
                        'incomplete' => 'Incomplete',
                        'incomplete_expired' => 'Incomplete Expired',
                        'unpaid' => 'Unpaid',
                    ]),
                Tables\Filters\Filter::make('active_subscriptions')
                    ->label('Active Only')
                    ->query(fn ($query) => $query->whereNull('ends_at'))
                    ->toggle(),
                Tables\Filters\Filter::make('canceled_subscriptions')
                    ->label('Canceled Only')
                    ->query(fn ($query) => $query->whereNotNull('ends_at'))
                    ->toggle(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                //
            ])
            ->defaultSort('created_at', 'desc');
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
            'index' => Pages\ListSubscriptions::route('/'),
            'view' => Pages\ViewSubscription::route('/{record}'),
        ];
    }

    public static function canCreate(): bool
    {
        return false; // Subscriptions are created through Stripe, not manually
    }

    public static function canEdit($record): bool
    {
        return false; // Subscriptions should be edited through Stripe
    }

    public static function canDelete($record): bool
    {
        return false; // Subscriptions should be canceled through Stripe
    }
}
