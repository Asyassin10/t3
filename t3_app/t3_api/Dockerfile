FROM php:8.2-apache as web

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    libzip-dev \
    zip \
    netcat-traditional \
    git \
    unzip

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Enable Apache modules
RUN a2enmod rewrite
RUN a2enmod headers

# Set custom php.ini file
COPY php.ini /usr/local/etc/php/php.ini

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql zip bcmath

# Configure Apache
COPY apache-vhost.conf /etc/apache2/sites-available/000-default.conf
RUN a2ensite 000-default.conf

# Copy the application code
COPY . /var/www/html

# Set the working directory
WORKDIR /var/www/html
# Create .env from example
RUN cp .env.example .env

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set COMPOSER_ALLOW_SUPERUSER to allow plugins to run as root
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install project dependencies
#RUN composer install --no-interaction --prefer-dist --optimize-autoloader
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --classmap-authoritative



# Set proper permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html/storage
RUN chmod -R 755 /var/www/html/bootstrap/cache

# Copy the entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
# Add these optimization commands after composer install:

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["apache2-foreground"]
