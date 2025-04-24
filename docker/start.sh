#!/bin/bash
set -e

echo "Starting PHP-FPM..."
php-fpm &

if [ ! -d "node_modules" ]; then
  echo "Installing Node dependencies..."
  npm install
fi

echo "Starting Vite..."
npm run dev &

echo "Starting Supervisor..."
/usr/bin/supervisord -c /etc/supervisor/supervisord.conf

wait -n
