#!/bin/bash
set -e

# Set permissions if directories exist
if [ -d "/var/www/html/storage" ]; then
    chmod -R 775 /var/www/html/storage
    chown -R www-data:www-data /var/www/html/storage
fi

if [ -d "/var/www/html/bootstrap/cache" ]; then
    chmod -R 775 /var/www/html/bootstrap/cache
    chown -R www-data:www-data /var/www/html/bootstrap/cache
fi

# Install Composer dependencies
echo "Installing Composer dependencies..."
composer install --no-interaction --optimize-autoloader

# Run migrations
echo "Running database migrations..."
php artisan migrate --force

# Initialize database
echo "Initializing database..."
php artisan init-database

# Install npm dependencies
echo "Installing npm dependencies..."
npm install

# Build frontend assets
echo "Building frontend assets..."
npm run build

# Start queue worker in background
echo "Starting queue worker..."
php artisan queue:work --sleep=3 --tries=3 &

# Start scheduler in background
echo "Starting task scheduler..."
while true; do 
    php artisan schedule:run --verbose --no-interaction
    sleep 60
done &

# Start cron
echo "Starting cron service..."
service cron start

# Execute the main command (Apache)
echo "Starting Apache..."
exec "$@"