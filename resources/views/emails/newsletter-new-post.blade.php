@extends('emails.layouts.base')

@section('content')
<p>{{ __('Dear') }} {{ $subscriber->email }},</p>
<p>{{ __('A new article has been published:') }} {{ $post->title }}</p>
<p><a href="{{ $postUrl }}">{{ __('Read more') }}</a></p>
<p>{{ __('If you did not subscribe, you can ignore this email.') }}</p>
@endsection