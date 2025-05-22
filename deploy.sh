#!/bin/bash

set -e
set -o pipefail

# Configuration
APP_USER="deployer"
APP_GROUP="www-data"
APP_BASE="/home/$APP_USER/laravel"
RELEASES_DIR="$APP_BASE/releases"
SHARED_DIR="$APP_BASE/shared"
CURRENT_LINK="$APP_BASE/current"
NOW=$(date +%Y-%m-%d-%H%M%S)-$(openssl rand -hex 3)
RELEASE_DIR="$RELEASES_DIR/$NOW"
ARCHIVE_NAME="release.tar.gz"

# Load NVM
export NVM_DIR="/home/$APP_USER/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Check Node.js and PM2
echo "▶️ Checking Node.js..."
node -v || { echo "❌ Node.js not found"; exit 1; }

echo "▶️ Checking PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "⚠️ PM2 not found, installing..."
    npm install -g pm2
fi
pm2 --version

echo "▶️ Create directories..."
mkdir -p "$RELEASES_DIR" "$SHARED_DIR/storage" "$SHARED_DIR/bootstrap_cache"
mkdir -p "$SHARED_DIR/storage/framework/"{views,cache,sessions}
mkdir -p "$SHARED_DIR/storage/logs"

echo "▶️ Unpacking release..."
mkdir -p "$RELEASE_DIR"
tar -xzf "$APP_BASE/$ARCHIVE_NAME" -C "$RELEASE_DIR"
rm -f "$APP_BASE/$ARCHIVE_NAME"

echo "▶️ Setting up symlinks..."
rm -rf "$RELEASE_DIR/storage"
ln -s "$SHARED_DIR/storage" "$RELEASE_DIR/storage"

rm -rf "$RELEASE_DIR/bootstrap/cache"
ln -s "$SHARED_DIR/bootstrap_cache" "$RELEASE_DIR/bootstrap/cache"

ln -sf "$SHARED_DIR/.env" "$RELEASE_DIR/.env"

echo "▶️ Optimizing application..."
cd "$RELEASE_DIR"
php artisan optimize:clear

# Reset opcache if available
if command -v opcache_reset &> /dev/null; then
    echo "▶️ Resetting OPcache..."
    php -r "opcache_reset();" || true
fi

# Reset Redis cache if available
if command -v redis-cli &> /dev/null; then
    echo "▶️ Flushing Redis cache..."
    redis-cli FLUSHALL || true
fi

php artisan optimize
php artisan storage:link

echo "▶️ Running database migrations..."
php artisan migrate --force

echo "▶️ Verifying SSR build..."
if [ ! -f "$RELEASE_DIR/bootstrap/ssr/ssr.js" ]; then
    echo "❌ SSR build not found!"
    exit 1
fi

echo "▶️ Managing SSR server with PM2..."
# Stop existing instance if running
pm2 delete inertia-ssr 2>/dev/null || true

# Update current symlink before starting
echo "▶️ Updating current symlink..."
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"

# Start/Restart SSR server
cd "$CURRENT_LINK"
pm2 start ecosystem.config.ts || pm2 reload ecosystem.config.ts

# Wait for SSR to initialize
echo "▶️ Waiting for SSR server to start..."
sleep 5

# Verify SSR process
if ! pm2 describe inertia-ssr &>/dev/null; then
    echo "❌ SSR server failed to start!"
    pm2 logs inertia-ssr --lines 20
    exit 1
fi

# Test SSR endpoint
echo "▶️ Testing SSR endpoint..."
if curl -fsS http://localhost:13714 &>/dev/null; then
    echo "✅ SSR server responding"
else
    echo "⚠️ SSR server not responding"
    pm2 logs inertia-ssr --lines 20
    exit 1
fi

echo "▶️ Cleaning old releases (keeping 5 latest)..."
cd "$RELEASES_DIR"
ls -dt */ | tail -n +6 | xargs -r rm -rf

echo "▶️ Current deployment status:"
pm2 list

echo "✅ Deployment successful: $NOW"
exit 0
