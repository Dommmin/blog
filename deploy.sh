#!/bin/bash

set -e
set -o pipefail

APP_USER="deployer"
APP_GROUP="www-data"
APP_BASE="/home/$APP_USER/laravel"
RELEASES_DIR="$APP_BASE/releases"
SHARED_DIR="$APP_BASE/shared"
CURRENT_LINK="$APP_BASE/current"
NOW=$(date +%Y-%m-%d-%H%M%S)-$(openssl rand -hex 3)
RELEASE_DIR="$RELEASES_DIR/$NOW"
ARCHIVE_NAME="release.tar.gz"

# Load NVM and get current Node.js version
export NVM_DIR="/home/$APP_USER/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
NODE_VERSION=$(nvm current)
PM2="$NVM_DIR/versions/node/$NODE_VERSION/bin/pm2"

echo "▶️ Using Node.js version: $NODE_VERSION"
echo "▶️ PM2 path: $PM2"

# Verify PM2 exists
if [ ! -f "$PM2" ]; then
    echo "❌ PM2 not found at $PM2"
    exit 1
fi

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

#echo "▶️ Checking SSR build..."
#if [ ! -f "$RELEASE_DIR/bootstrap/ssr/ssr.js" ]; then
#    echo "❌ SSR build not found! Check your build process."
#    exit 1
#fi
#
#echo "▶️ Managing SSR server with PM2..."
## Stop current SSR server gracefully
#pm2 stop inertia-ssr 2>/dev/null || echo "No previous SSR server to stop"

# Update symlink first
echo "▶️ Updating current symlink..."
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"

# Start SSR server from new release
#cd "$CURRENT_LINK"
#pm2 start ecosystem.config.ts 2>/dev/null || pm2 reload inertia-ssr
#
## Wait a moment for SSR to start
#sleep 3
#
## Verify SSR is running
#echo "▶️ Verifying SSR server..."
#if ! pm2 describe inertia-ssr &>/dev/null; then
#    echo "❌ SSR server failed to start!"
#    exit 1
#fi
#
## Test SSR endpoint
#if curl -f http://127.0.0.1:13714 &>/dev/null; then
#    echo "✅ SSR server is responding"
#else
#    echo "⚠️ SSR server may not be responding properly"
#fi

echo "▶️ Cleaning old releases (keeping 5 latest)..."
cd "$RELEASES_DIR"
ls -dt */ | tail -n +6 | xargs -r rm -rf

echo "▶️ Current deployment status:"
$PM2 list

echo "✅ Deployment successful: $NOW"
exit 0
