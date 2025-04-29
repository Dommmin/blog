<p>Hello!</p>
<p>A new post has been published on the blog:</p>
<p><strong>{{ $post->title }}</strong></p>
<p>{{ $post->excerpt ?? '' }}</p>
<p><a href="{{ url('/blog/' . $post->slug) }}">Read the post</a></p>
<p>Thank you for subscribing!</p> 