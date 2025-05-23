<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') === 'dark'])>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- DNS prefetch i preconnect dla szybszego ładowania --}}
    <link rel="dns-prefetch" href="//fonts.bunny.net">
    <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>

    {{-- Preload krytycznych fontów --}}
    <link rel="preload" href="https://fonts.bunny.net/instrument-sans/files/instrument-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="https://fonts.bunny.net/instrument-sans/files/instrument-sans-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="https://fonts.bunny.net/instrument-sans/files/instrument-sans-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>

    {{-- Inline critical CSS z font-display: swap --}}
    <style>
        /* Critical CSS - renderowanie bez blokowania */
        html {
            background-color: oklch(1 0 0);
        }
        html.dark {
            background-color: oklch(0.145 0 0);
        }

        /* Font face z font-display: swap dla lepszego FCP */
        @font-face {
            font-family: 'Instrument Sans';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('https://fonts.bunny.net/instrument-sans/files/instrument-sans-latin-400-normal.woff2') format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
        @font-face {
            font-family: 'Instrument Sans';
            font-style: normal;
            font-weight: 500;
            font-display: swap;
            src: url('https://fonts.bunny.net/instrument-sans/files/instrument-sans-latin-500-normal.woff2') format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
        @font-face {
            font-family: 'Instrument Sans';
            font-style: normal;
            font-weight: 600;
            font-display: swap;
            src: url('https://fonts.bunny.net/instrument-sans/files/instrument-sans-latin-600-normal.woff2') format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FFFD;
        }

        /* Podstawowe style dla uniknięcia FOUC */
        body {
            font-family: 'Instrument Sans', system-ui, -apple-system, sans-serif;
            font-feature-settings: 'rlig' 1, 'calt' 1;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
        }

        /* Loading state aby uniknąć CLS */
        .loading-skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }

        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        /* Dark mode skeleton */
        .dark .loading-skeleton {
            background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
            background-size: 200% 100%;
        }
    </style>

    {{-- Inline script dla dark mode (bez blokowania renderowania) --}}
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

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    {{-- Meta tags dla performance --}}
    <meta name="theme-color" content="#ffffff">
    <meta name="color-scheme" content="light dark">

    {{-- Resource hints --}}
    <link rel="dns-prefetch" href="//{{ request()->getHost() }}">

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead

    {{-- Preload krytycznych CSS jeśli są osobne --}}
    @if(app()->environment('production'))
        <link rel="preload" href="{{ Vite::asset('resources/css/app.css') }}" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <noscript><link rel="stylesheet" href="{{ Vite::asset('resources/css/app.css') }}"></noscript>
    @endif
</head>
<body class="font-sans antialiased">
@inertia
</body>
</html>
