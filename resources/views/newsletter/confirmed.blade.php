@extends('layouts.app')

@section('content')
<div class="min-h-screen flex items-center justify-center">
    <div class="max-w-2xl w-full mx-4 bg-white rounded-lg shadow-md p-8">
        <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ __('Newsletter Subscription Confirmed') }}</h1>
            <div class="space-y-4 text-gray-600">
                <p>{{ __('Thank you for confirming your newsletter subscription!') }}</p>
                <p>{{ __('You will now receive updates about new articles and content.') }}</p>
            </div>
        </div>
    </div>
</div>
@endsection