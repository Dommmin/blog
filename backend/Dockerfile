FROM php:8.2-fpm

COPY php.ini /usr/local/etc/php/conf.d/docker-php-config.ini

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev

# Install PHP extensions
RUN docker-php-ext-install gd pdo pdo_mysql zip mbstring exif pcntl bcmath

RUN docker-php-ext-configure gd --with-jpeg --with-freetype
RUN docker-php-ext-install -j$(nproc) gd

# Install PECL extensions
RUN pecl install redis \
    && docker-php-ext-enable redis


# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app/backend

COPY composer.json composer.lock ./

RUN composer install --no-dev --optimize-autoloader --no-scripts

COPY . .

EXPOSE 8000

ADD .tools/scripts/ /srv/

ENTRYPOINT ["/bin/sh", "/srv/startup.sh"]
