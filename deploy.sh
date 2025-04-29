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

echo "▶️ Tworzenie struktury katalogów..."
mkdir -p "$RELEASES_DIR" "$SHARED_DIR/storage" "$SHARED_DIR/bootstrap_cache"

# Dodajemy katalogi dla widoków i cache
mkdir -p "$SHARED_DIR/storage/framework/views"
mkdir -p "$SHARED_DIR/storage/framework/cache"
mkdir -p "$SHARED_DIR/storage/framework/sessions"
mkdir -p "$SHARED_DIR/storage/logs"

echo "▶️ Rozpakowywanie paczki..."
mkdir "$RELEASE_DIR"
tar -xzf "$APP_BASE/$ARCHIVE_NAME" -C "$RELEASE_DIR"
rm "$APP_BASE/$ARCHIVE_NAME"

echo "▶️ Linkowanie shared zasobów..."
rm -rf "$RELEASE_DIR/storage"
ln -s "$SHARED_DIR/storage" "$RELEASE_DIR/storage"

rm -rf "$RELEASE_DIR/bootstrap/cache"
ln -s "$SHARED_DIR/bootstrap_cache" "$RELEASE_DIR/bootstrap/cache"

ln -sf "$SHARED_DIR/.env" "$RELEASE_DIR/.env"

echo "▶️ Nadawanie uprawnień..."
# Ustaw poprawne uprawnienia i właściciela dla shared i release
chown -R "$APP_USER:$APP_GROUP" "$RELEASE_DIR" "$SHARED_DIR"
find "$RELEASE_DIR" -type d -exec chmod 2775 {} \;
find "$RELEASE_DIR" -type f -exec chmod 664 {} \;
find "$SHARED_DIR" -type d -exec chmod 2775 {} \;
find "$SHARED_DIR" -type f -exec chmod 664 {} \;
# Ustaw setgid na storage i bootstrap_cache, by nowe pliki dziedziczyły grupę
chmod g+s "$SHARED_DIR/storage"
chmod g+s "$SHARED_DIR/bootstrap_cache"

echo "▶️ Optymalizacja aplikacji Laravel..."
cd "$RELEASE_DIR"
php artisan optimize:clear
php artisan optimize

echo "▶️ Migracje bazy danych..."
php artisan migrate --force

echo "▶️ Ustawianie symlinku current..."
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"

echo "▶️ Czyszczenie starych release'ów..."
cd "$RELEASES_DIR"
ls -dt */ | tail -n +6 | xargs -r rm -rf

echo "✅ Deployment zakończony: $NOW"
