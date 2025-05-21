@extends('emails.layouts.base')

@section('content')
    <p>{{ __('Thank you for subscribing to the newsletter!') }}</p>
    <p>{{ __('You will receive an email every time a new article is published.') }}</p>
    <p>{{ __('If you want to unsubscribe, you can do so by clicking the link below:') }}</p>
    <p><a href="{{ $unsubscribeUrl }}">{{ __('Unsubscribe') }}</a></p>
@endsection
