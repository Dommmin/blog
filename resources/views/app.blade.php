<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark'=> ($appearance ?? 'system') === 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    @php
    $seo = $page['props']['seo'];
    $title = __(Arr::get($seo, 'title'));
    $description = __(Arr::get($seo, 'description'));
    @endphp

    <title>{{ $title }}</title>

    <meta name="theme-color" content="#ffffff">
    <meta name="color-scheme" content="light dark">
    <meta name="title" content="{{ $title }}">
    <meta name="description" content="{{ $description }}">
    <meta name="author" content="Dominik Jasiński">

    <!-- PWA -->
    <link rel="manifest" href="/manifest.json">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="Tech Blog">
    <link rel="apple-touch-icon" href="/pwa-192x192.png">
    <meta name="msapplication-TileImage" content="/pwa-192x192.png">
    <meta name="msapplication-TileColor" content="#ffffff">

    <meta property="og:title" content="{{ $title }}">
    <meta property="og:description" content="{{ $description }}">
    <meta property="og:type" content="{{ $seo['type'] }}">
    <meta property="og:url" content="{{ $seo['url'] }}">

    @if(isset($seo['article']))

    <meta property="article:published_time" content="{{ $seo['article']['published_time'] }}">
    <meta property="article:modified_time" content="{{ $seo['article']['modified_time'] }}">
    <meta property="article:author" content="{{ $seo['article']['author'] }}">
    <meta property="article:section" content="{{ $seo['article']['section'] }}">
    @foreach($seo['article']['tags'] as $tag)

    <meta property="article:tag" content="{{ $tag }}">
    @endforeach
    @endif

    <link rel="canonical" href="{{ $seo['canonical'] }}">

    <script type="application/ld+json">
        {!!json_encode($seo['structuredData'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
    </script>

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead

    @if(app()->environment('production'))
    <link rel="preload" href="{{ Vite::asset('resources/css/app.css') }}" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="{{ Vite::asset('resources/css/app.css') }}">
    </noscript>
    @endif
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
