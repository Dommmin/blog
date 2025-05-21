#!/bin/bash

# Create icons directory if it doesn't exist
mkdir -p public/icons

# Copy the generated logo to different sizes
cp public/logo.png public/icons/pwa-192x192.png
cp public/logo.png public/icons/pwa-512x512.png
cp public/logo.png public/icons/apple-touch-icon.png
cp public/logo.png public/icons/maskable-icon.png

# Copy icons to public directory
cp public/icons/pwa-192x192.png public/
cp public/icons/pwa-512x512.png public/
cp public/icons/apple-touch-icon.png public/
cp public/icons/maskable-icon.png public/masked-icon.svg

echo "PWA icons generated successfully!"