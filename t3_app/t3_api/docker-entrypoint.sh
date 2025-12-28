#!/bin/bash




# Set proper permissions
chown -R www-data:www-data /var/www/html/public /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/public /var/www/html/storage /var/www/html/bootstrap/cache

# Wait for MySQL to be ready
until nc -z -v -w30 t3_app_mysql_service 3306
do
  echo "Waiting for database connection..."
  sleep 5
done

# Initialize the application
echo "Running composer install..."

composer install --no-interaction
echo "Running migrations..."

php artisan migrate
echo "Clearing cache..."
php artisan init-database
php artisan optimize:clear

php artisan app:init-client-esoft

cd /var/www/html

if [ -f package.json ]; then
    echo "Running npm install..."
    npm install

    echo "Running npm run build..."
    npm run build
fi
echo "=== Starting Apache ==="

# Start Apache
exec "$@"
