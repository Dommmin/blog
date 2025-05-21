@extends('emails.layouts.base')

@section('content')
    <p>{{ __('Thank you for subscribing to the newsletter!') }}</p>
    <p>{{ __('To confirm your subscription, click the link below:') }}</p>
    <p><a href="{{ $confirmUrl }}">{{ __('Confirm subscription') }}</a></p>
    <p>{{ __('If you did not subscribe, you can ignore this email.') }}</p>
@endsection
