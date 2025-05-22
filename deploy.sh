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

echo "▶️ Node.js version:"
node -v || { echo "❌ Node.js not found"; exit 1; }

echo "▶️ PM2 version:"
pm2 --version || { echo "❌ PM2 not found"; exit 1; }

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
# Force PM2 to use Node.js instead of Bun
export PM2_RUNTIME='node'

# Check existing process
pm2 describe inertia-ssr >/dev/null 2>&1 && {
    echo "🔄 Reloading existing SSR server..."
    pm2 reload inertia-ssr --update-env
} || {
    echo "🆕 Starting new SSR server..."
    cd "$RELEASE_DIR"
    pm2 start ecosystem.config.ts --update-env
}

# Update symlink after successful PM2 operation
echo "▶️ Updating current symlink..."
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"

echo "▶️ Waiting for SSR server to start..."
sleep 5

# Verify SSR process
if ! pm2 describe inertia-ssr >/dev/null 2>&1; then
    echo "❌ SSR server failed to start!"
    pm2 logs inertia-ssr --lines 20
    exit 1
fi

# Test SSR endpoint
echo "▶️ Testing SSR endpoint..."
if curl -fsS http://localhost:13714 >/dev/null 2>&1; then
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
