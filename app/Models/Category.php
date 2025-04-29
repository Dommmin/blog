<?php

namespace App\Models;

use App\Observers\CategoryObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

#[ObservedBy(CategoryObserver::class)]
class Category extends Model implements CacheInterface
{
    use HasFactory, HasSlug;

    protected $guarded = ['id'];

    protected string $tag = 'categories';

    public function post(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function flush(): bool
    {
        return Cache::tags($this->tag)->flush();
    }
}
