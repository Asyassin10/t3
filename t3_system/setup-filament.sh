#!/bin/bash

# Run these commands inside t3_system Docker container

echo "Installing Filament and publishing assets..."

# Install Composer dependencies (includes Filament)
composer install --no-dev

# Publish Filament assets
php artisan filament:assets

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Run migrations
php artisan migrate

# Seed admin user
php artisan db:seed --class=AdminUserSeeder

echo "Done! Access admin at http://localhost:8234/admin"
echo "Login: admin@t3system.com / admin123"
