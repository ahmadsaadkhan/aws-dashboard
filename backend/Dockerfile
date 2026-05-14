FROM php:8.3-fpm-alpine

WORKDIR /var/www

RUN apk add --no-cache \
    git curl zip unzip libpng-dev oniguruma-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip opcache

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN chown -R www-data:www-data /var/www

EXPOSE 80

CMD ["php", "-S", "0.0.0.0:80", "-t", "public"]