<?php

namespace App\Observers;

use App\Models\Post;
use Illuminate\Support\Facades\Cache;

class PostObserver
{
    public function saved(Post $post)
    {
        Cache::tags('posts')->flush();
    }

    public function deleted(Post $post): void
    {
        Cache::tags('posts')->flush();
    }
}
