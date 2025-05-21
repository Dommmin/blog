<?php

namespace App\Observers;

use App\Jobs\SendNewPostToSubscribers;
use App\Models\Post;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class PostObserver
{
    public function saving(Post $post)
    {
        $post->reading_time = reading_time($post->content);

        if (! $post->translation_key) {
            $post->translation_key = Str::uuid()->toString();
        }
    }

    public function saved(Post $post)
    {
        Cache::tags('posts')->flush();

        if ($post->wasRecentlyCreated) {
            SendNewPostToSubscribers::dispatch($post);
        }
    }

    public function deleted(Post $post): void
    {
        Cache::tags('posts')->flush();
    }
}
