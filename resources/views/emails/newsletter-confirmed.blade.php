@extends('emails.layouts.base')

@section('content')
<p class="mb-4">{{ __('Thank you for subscribing to the newsletter!') }}</p>
<p class="mb-6">{{ __('You will receive an email every time a new article is published.') }}</p>

<p class="mb-6">{{ __('If you want to unsubscribe, you can do so by clicking the button below:') }}</p>

<a href="{{ $unsubscribeUrl }}" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200">
    {{ __('Unsubscribe') }}
</a>
@endsection