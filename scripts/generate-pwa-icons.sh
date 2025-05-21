#!/bin/bash

# Create icons directory if it doesn't exist
mkdir -p public/icons

# Generate PWA icons using ImageMagick
convert public/logo.png -resize 192x192 public/icons/pwa-192x192.png
convert public/logo.png -resize 512x512 public/icons/pwa-512x512.png
convert public/logo.png -resize 180x180 public/icons/apple-touch-icon.png
convert public/logo.png -resize 512x512 public/icons/maskable-icon.png

# Copy icons to public directory
cp public/icons/pwa-192x192.png public/
cp public/icons/pwa-512x512.png public/
cp public/icons/apple-touch-icon.png public/
cp public/icons/maskable-icon.png public/masked-icon.svg

echo "PWA icons generated successfully!"
