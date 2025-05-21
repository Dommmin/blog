@extends('emails.layouts.base')

@section('content')
<p>{{ __('A new article has been published on the blog!') }}</p>
<p><strong>{{ $post->title }}</strong></p>
<p>{{ $post->excerpt ?? Str::limit(strip_tags($post->content), 150) }}</p>
<p><a href="{{ url('/blog/' . $post->slug) }}">{{ __('Read more') }}</a></p>
@endsection