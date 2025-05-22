<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark'=> ($appearance ?? 'system') == 'dark']) class="h-full">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Preload critical assets --}}
    <link rel="preload" href="{{ mix('css/app.css') }}" as="style">
    <link rel="preload" href="{{ mix('js/app.js') }}" as="script">
    <link rel="preload" href="{{ asset('fonts/Inter-var.woff2') }}" as="font" type="font/woff2" crossorigin>

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? "system" }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }

        /* Critical CSS for initial render */
        .text-muted-foreground {
            color: oklch(0.5 0 0);
        }

        .mx-auto {
            margin-left: auto;
            margin-right: auto;
        }

        .max-w-2xl {
            max-width: 42rem;
        }

        .text-lg {
            font-size: 1.125rem;
            line-height: 1.75rem;
        }

        /* Optimize font loading */
        .font-sans {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        /* Add font-display swap for better performance */
        @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 100 900;
            font-display: swap;
            src: url('/fonts/Inter-var.woff2') format('woff2');
        }
    </style>

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#ffffff">
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <meta name="mobile-web-app-capable" content="yes">

    {{-- Add resource hints --}}
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="preconnect" href="//fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="//fonts.gstatic.com" crossorigin>

    <!-- SEO Meta Tags -->
    <meta name="description" content="Technology and Programming Articles - Learn about PHP, Laravel, Symfony, JavaScript, and DevOps practices.">
    <meta name="keywords" content="PHP, Laravel, Symfony, JavaScript, React, Vue, DevOps, Programming, Web Development">
    <meta name="author" content="Dominik Jasiński">

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="{{ config('app.name', 'Laravel') }}">
    <meta property="og:description" content="Technology and Programming Articles - Learn about PHP, Laravel, Symfony, JavaScript, and DevOps practices.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:image" content="{{ asset('og-image.jpg') }}">

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ config('app.name', 'Laravel') }}">
    <meta name="twitter:description" content="Technology and Programming Articles - Learn about PHP, Laravel, Symfony, JavaScript, and DevOps practices.">
    <meta name="twitter:image" content="{{ asset('og-image.jpg') }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Preload critical fonts -->
    <link rel="preload" href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600&display=swap" as="style">
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style">

    <!-- Load fonts with display swap -->
    <style>
        @font-face {
            font-family: 'Instrument Sans';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url(https://fonts.bunny.net/s/instrumentsans/v1/pxiDypQoyQz2JyPxGmN-VMtlplQ-PI0Q.woff2) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
    </style>

    <!-- Fallback font loading -->
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
