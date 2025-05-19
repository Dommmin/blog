<?php

namespace App\Observers;

use App\Models\Comment;
use Illuminate\Support\Facades\Cache;

class CommentObserver
{
    public function saved(Comment $comment)
    {
        Cache::tags('comments')->flush();
        Cache::tags('posts')->flush();
    }

    public function deleted(Comment $comment): void
    {
        Cache::tags('comments')->flush();
        Cache::tags('posts')->flush();
    }
}
