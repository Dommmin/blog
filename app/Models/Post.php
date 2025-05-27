<?php

namespace App\Models;

use App\Observers\PostObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;
use Laravel\Scout\Searchable;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use App\Models\CacheInterface;

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

    //    public function category(): BelongsTo
    //    {
    //        return $this->belongsTo(Category::class);
    //    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function translations(): HasMany
    {
        return $this->hasMany(Post::class, 'translation_key', 'translation_key')
            ->where('id', '!=', $this->id);
    }

    public function file(): BelongsTo
    {
        return $this->belongsTo(File::class);
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

    public function scopeLanguage(Builder $query, string $language): Builder
    {
        return $query->where('language', $language);
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

    /**
     * Get the translation of this post in the specified language.
     */
    public function getTranslation(string $language): ?Post
    {
        return static::where('translation_key', $this->translation_key)
            ->where('language', $language)
            ->first();
    }

    public function hasTranslation(string $language): bool
    {
        return $this->translations()->where('language', $language)->exists();
    }

    public function getExcerptAttribute()
    {
        return substr($this->content, 0, 100);
    }

    public static function getSuggestions(string $query, string $language)
    {
        // if (! config('scout.enabled')) {
        //     return self::query()
        //         ->where('title', 'like', "%{$query}%")
        //         ->where('published_at', '<=', now())
        //         ->take(5)
        //         ->get()
        //         ->map(fn ($post) => [
        //             'id' => $post->id,
        //             'title' => $post->title,
        //         ])
        //         ->values();
        // }

        return self::search($query)
            ->query(fn (Builder $query) => $query->where('language', $language))
            ->take(5)
            ->get()
            ->map(fn ($post) => [
                'id' => $post->id,
                'title' => $post->title,
            ])
            ->values();
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

    public static function flush(): void
    {
        Cache::tags(self::TAG)->flush();
    }

    public function toSearchableArray(): array
    {
        $this->load(['tags']);

        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'content' => $this->content,
            //            'category_name' => $this->category->name ?? '',
            'tags_names' => $this->tags->pluck('name')->toArray(),
            'published_at' => $this->published_at->timestamp,
            'language' => $this->language,
        ];
    }

    public function searchableAs(): string
    {
        return 'posts_index';
    }

    public function visits(): HasMany
    {
        return $this->hasMany(PostVisit::class);
    }
}
