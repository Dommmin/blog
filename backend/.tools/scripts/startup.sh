#!/bin/sh

#php artisan queue:work
#php artisan queue:work redis --queue=scout
#composer install --no-dev --optimize-autoloader --no-scripts

mkdir -p storage/framework/{sessions,views,cache}
php artisan storage:link
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
php artisan migrate --force
php artisan key:generate

php artisan octane:start --watch --workers=10 --host=0.0.0.0 --port=8000
#php artisan serve --host=0.0.0.0 --port=8000
