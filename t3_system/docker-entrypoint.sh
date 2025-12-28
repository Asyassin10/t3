#!/bin/bash

# Set permissions if directories exist
if [ -d "/var/www/html/storage" ]; then
    chmod -R 775 /var/www/html/storage
    chown -R www-data:www-data /var/www/html/storage
fi

if [ -d "/var/www/html/bootstrap/cache" ]; then
    chmod -R 775 /var/www/html/bootstrap/cache
    chown -R www-data:www-data /var/www/html/bootstrap/cache
fi

# Start cron
service cron start

# Execute the main command (Apache)
exec "$@"