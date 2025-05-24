@extends('emails.layouts.base')

@section('content')
<p class="mb-4">{{ __('Thank you for subscribing to the newsletter!') }}</p>
<p class="mb-6">{{ __('To confirm your subscription, click the button below:') }}</p>

<a href="{{ $confirmUrl }}" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200">
    {{ __('Confirm subscription') }}
</a>

<p class="mt-6 text-gray-600">{{ __('If you did not subscribe, you can ignore this email.') }}</p>
@endsection