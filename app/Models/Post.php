<?php

namespace App\Models;

use App\Observers\PostObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Cache;
use Laravel\Scout\Searchable;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

#[ObservedBy(PostObserver::class)]
class Post extends Model implements CacheInterface
{
    use HasFactory, HasSlug, Searchable;

    protected $guarded = ['id'];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    protected const TAG = 'posts';

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('published_at', '<=', now())
            ->whereNotNull('published_at');
    }

    public function scopeDraft(Builder $query): Builder
    {
        return $query->whereNull('published_at')
            ->orWhere('published_at', '>', now());
    }

    public function isPublished(): bool
    {
        return $this->published_at !== null && $this->published_at <= now();
    }

    public function isDraft(): bool
    {
        return ! $this->isPublished();
    }

    public function getPublishedAtFormattedAttribute(): string
    {
        return $this->published_at->format('F j, Y');
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public static function flush(): bool
    {
        return Cache::tags(self::TAG)->flush();
    }

    public function toSearchableArray(): array
    {
        $this->load(['category', 'tags']);

        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'category_name' => $this->category->name,
            'tags_names' => $this->tags->pluck('name')->toArray(),
            'published_at' => $this->published_at->timestamp,
        ];
    }

    public function searchableAs(): string
    {
        return 'posts_index';
    }
}
