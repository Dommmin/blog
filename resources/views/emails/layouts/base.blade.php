<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }}</title>
</head>

<body class="bg-gray-100 font-sans text-gray-800 leading-normal">
    <div class="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-blue-600 px-6 py-8 text-center">
                <h1 class="text-2xl font-semibold text-white">{{ config('app.name') }}</h1>
            </div>

            <div class="px-6 py-8">
                @yield('content')
            </div>

            <div class="bg-gray-50 px-6 py-6 border-t border-gray-200 text-center">
                <p class="text-sm text-gray-600 mb-2">{{ __('This email was sent to') }} {{ $subscriber->email ?? '' }}</p>
                <p class="text-sm text-gray-600 mb-2">{{ __('If you did not request this email, you can safely ignore it.') }}</p>
                <p class="text-sm text-gray-600">&copy; {{ date('Y') }} {{ config('app.name') }}. {{ __('All rights reserved.') }}</p>
            </div>
        </div>
    </div>
</body>

</html>