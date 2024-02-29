<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Laravel\Scout\Searchable;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Post extends Model
{
    use HasFactory;
    use HasSlug;
    use Searchable;

    protected $guarded = [];

    //    public function getRouteKeyName(): string
    //    {
    //        return 'slug';
    //    }

    public static function getProducts()
    {
        $request = request();

        return self::query()
            ->when($request->has('search'), function ($query) use ($request): void {
                $query
                    ->where('title', 'like', '%' . $request->query('search') . '%')
                    ->orWhere('body', 'like', '%' . $request->query('search') . '%');
            })
            ->when($request->has('tags'), function ($query) use ($request): void {
                $tags = $request->query('tags');
                if (is_array($tags)) {
                    $query->whereHas('tags', function ($query) use ($tags): void {
                        $query->whereIn('name', $tags);
                    });
                }
            })
            ->with('user:id,name', 'isVotedByUser', 'tags:id,name')
            ->withCount(['comments', 'votes', 'views'])
            ->latest('id')
            ->simplePaginate(20);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function bookmarks(): HasMany
    {
        return $this->hasMany(Bookmark::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function spams(): MorphMany
    {
        return $this->morphMany(Spam::class, 'spamable');
    }

    public function views(): HasMany
    {
        return $this->hasMany(PostView::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }

    public function isVotedByUser(): HasOne
    {
        return $this->hasOne(Vote::class)->where('user_id', auth()->id());
    }

    public function scopePublished($query)
    {
        return $query->where('published', true);
    }

    public function getCreatedAtAttribute($value): string
    {
        return Carbon::parse($value)->diffForHumans();
    }

    public function getUpdatedAtAttribute($value): string
    {
        return Carbon::parse($value)->diffForHumans();
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->getKey(),
            'title' => $this->title,
            'body' => $this->body,
        ];
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }
}
