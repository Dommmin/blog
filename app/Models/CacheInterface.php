<?php

namespace App\Models;

interface CacheInterface
{
    /**
     * Flush the cache for the model.
     */
    public function flush(): bool;
}
