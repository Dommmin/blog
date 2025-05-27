<?php

namespace App\Models;

use App\Observers\FileObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Cache;
use App\Models\CacheInterface;

#[ObservedBy(FileObserver::class)]
class File extends Model implements CacheInterface
{
    protected $fillable = [
        'name',
        'original_name',
        'path',
        'mime_type',
        'size',
        'extension',
    ];

    protected $appends = ['url'];

    protected const TAG = 'files';

    protected function url(): Attribute
    {
        return Attribute::make(get: function () {
            return asset('storage/' . $this->path);
        });
    }

    public static function flush(): void
    {
        Cache::tags(self::TAG)->flush();
    }
}
