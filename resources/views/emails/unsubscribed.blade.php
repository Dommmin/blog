<!DOCTYPE html>
<html>

<head>
    <title>{{ __('You have unsubscribed from the newsletter') }}</title>
</head>

<body>
    <h1>{{ __('You have unsubscribed from the newsletter') }}</h1>
    <p>{{ __('Dear') }} {{ $subscriber->email }},</p>
    <p>{{ __('You have successfully unsubscribed from our newsletter. If you did not request this, please contact us.') }}</p>
    <p>{{ __('Thank you for your time.') }}</p>
</body>

</html>