<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Cache;
use App\Observers\CommentObserver;

#[ObservedBy(CommentObserver::class)]
class Comment extends Model implements CacheInterface
{
    use HasFactory;

    protected $guarded = ['id'];

    protected const TAG = 'comments';

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public static function flush(): void
    {
        Cache::tags(self::TAG)->flush();
    }
}
