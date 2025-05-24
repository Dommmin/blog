@extends('emails.layouts.base')

@section('content')
<p class="mb-4">{{ __('Dear') }} {{ $subscriber->email }},</p>
<p class="mb-6">{{ __('A new article has been published on the blog!') }}</p>

<h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $post->title }}</h2>

<div class="bg-gray-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
    <p class="text-gray-700">{{ Str::limit(strip_tags($post->content), 150) }}</p>
</div>

<a href="{{ $postUrl }}" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200">
    {{ __('Read more') }}
</a>

<p class="mt-6 text-gray-600">{{ __('If you did not subscribe, you can ignore this email.') }}</p>
@endsection