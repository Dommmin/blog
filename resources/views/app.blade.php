<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') === 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    @if (app()->environment('production'))
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
    @endif

    @php
        $seo = $page['props']['seo'];
        $title = __(Arr::get($seo, 'title'));
        $description = __(Arr::get($seo, 'description'));
    @endphp

    <title>{{ $title }}</title>

    @php
        $seo = $page['props']['seo'];
        $title = __(Arr::get($seo, 'title'));
        $description = __(Arr::get($seo, 'description'));
    @endphp

    <title>{{ $title }}</title>

    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">

    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
    <meta name="color-scheme" content="light dark">
    <meta name="title" content="{{ $title }}">
    <meta name="description" content="{{ $description }}">
    <meta name="author" content="Dominik Jasiński">

    <meta name="robots" content="{{ $seo['robots'] ?? 'index, follow' }}">

    <meta property="og:title" content="{{ $title }}">
    <meta property="og:description" content="{{ $description }}">
    <meta property="og:type" content="{{ $seo['type'] }}">
    <meta property="og:url" content="{{ $seo['url'] }}">
    <meta property="og:image" content="{{ $seo['image'] ?? asset('logo.png') }}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $title }}">
    <meta name="twitter:description" content="{{ $description }}">
    <meta name="twitter:image" content="{{ $seo['image'] ?? asset('logo.png') }}">

    @if (isset($seo['article']))
        <meta property="article:published_time" content="{{ $seo['article']['published_time'] }}">
        <meta property="article:modified_time" content="{{ $seo['article']['modified_time'] }}">
        <meta property="article:author" content="{{ $seo['article']['author'] }}">
        <meta property="article:section" content="{{ $seo['article']['section'] }}">
        @foreach ($seo['article']['tags'] as $tag)
            <meta property="article:tag" content="{{ $tag }}">
        @endforeach
    @endif

    <link rel="canonical" href="{{ $seo['canonical'] }}">

    @foreach (available_locales() as $locale)
        <link rel="alternate" hreflang="{{ $locale }}" href="{{ url($locale . '/' . request()->path()) }}" />
    @endforeach
    <link rel="alternate" hreflang="x-default" href="{{ url('pl/' . request()->path()) }}" />

    <script type="application/ld+json">
        @json($seo['structuredData'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT)
    </script>

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead

    @if (app()->environment('production'))
        <link rel="preload" href="{{ Vite::asset('resources/css/app.css') }}" as="style"
            onload="this.onload=null;this.rel='stylesheet'">
        <noscript>
            <link rel="stylesheet" href="{{ Vite::asset('resources/css/app.css') }}">
        </noscript>
    @endif

    <script src="https://platform.linkedin.com/badges/js/profile.js" async defer type="text/javascript"></script>

    <!-- PWA -->
    <link rel="manifest" href="/manifest.json">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="Tech Blog">
    <link rel="apple-touch-icon" href="/pwa-192x192.png">
    <meta name="msapplication-TileImage" content="/pwa-192x192.png">
    <meta name="msapplication-TileColor" content="#ffffff">

    <link rel="icon" href="/favicon.ico">
    <link rel="shortcut icon" href="/favicon.ico">

    <!-- hreflang for international SEO -->
    <link rel="alternate" hreflang="pl" href="https://dominik-dev.pl/pl" />
    <link rel="alternate" hreflang="en" href="https://dominik-dev.pl/en" />
    <link rel="alternate" hreflang="de" href="https://dominik-dev.pl/de" />
    <link rel="alternate" hreflang="x-default" href="https://dominik-dev.pl/pl" />
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
