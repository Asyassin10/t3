FROM php:8.2-apache as web

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    libzip-dev \
    cron \
    zip
# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs
# Enable mod_rewrite
RUN a2enmod rewrite

# Set custom php.ini file
COPY php.ini /usr/local/etc/php/php.ini

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql zip bcmath

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Copy the application code
COPY . /var/www/html

# Set the working directory
WORKDIR /var/www/html

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# Set COMPOSER_ALLOW_SUPERUSER to allow plugins to run as root
ENV COMPOSER_ALLOW_SUPERUSER=1
# Install project dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader
# Set ownership of the storage and bootstrap/cache directories to the web server user (www-data)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Set proper permissions (read/write for the owner and group)
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
# Install npm dependencies
# Install npm dependencies BEFORE running build
RUN npm install
COPY laravel-cron /etc/cron.d/laravel-cron
RUN chmod 0644 /etc/cron.d/laravel-cron
RUN crontab /etc/cron.d/laravel-cron
RUN npm run build 


# Copy the entrypoint script into the container
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Set the script as the entrypoint
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Run Apache as the default command
CMD ["apache2-foreground"]


# Expose port 80
EXPOSE 80