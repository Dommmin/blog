<?php

namespace App\Observers;

use App\Models\Tag;
use Illuminate\Support\Facades\Cache;

class TagObserver
{
    public function saved(Tag $tag)
    {
        Cache::tags('tags')->flush();
    }

    public function deleted(Tag $tag): void
    {
        Cache::tags('tags')->flush();
    }
}
