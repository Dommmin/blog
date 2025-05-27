<?php

namespace App\Observers;

use App\Models\File;
use Illuminate\Support\Facades\Cache;

class FileObserver
{
    public function saved(File $file)
    {
        Cache::tags('files')->flush();
    }

    public function deleted(File $file): void
    {
        Cache::tags('files')->flush();
    }
}
