<?php

namespace App\Repositories;

use App\Models\Post;
use App\Repositories\Contracts\PostRepositoryInterface;
use Arr;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class PostRepository implements PostRepositoryInterface
{
    public function getPaginated(int $perPage = 10): LengthAwarePaginator
    {
        return Cache::tags('posts')->rememberForever('admin.posts.index.'.request()->get('page', 1), function () use ($perPage) {
            return Post::query()
                ->with('author')
                ->latest('created_at')
                ->paginate($perPage);
        });
    }

    public function find(string $slug, string $language = 'en'): ?Post
    {
        return Cache::tags('posts')->rememberForever("post.{$slug}.{$language}", function () use ($slug, $language) {
            return Post::where('slug', $slug)
                ->where('language', $language)
                ->where('published_at', '<=', now())
                ->with(['author', 'tags'])
                ->withCount('comments')
                ->first();
        });
    }

    public function create(array $data): Post
    {
        return Post::create($data);
    }

    public function update(Post $post, array $data): Post
    {
        $post->update($data);

        return $post;
    }

    public function delete(Post $post): bool
    {
        return $post->delete();
    }

    public function syncTags(Post $post, array $tagIds): void
    {
        $post->tags()->sync($tagIds);
        Post::flush();
    }

    public function getPostsForBlog(array $filters): LengthAwarePaginator
    {
        /** @var Builder $query */
        $query = Post::query()
            ->with(['author', 'tags'])
            ->withCount('comments')
            ->published()
            ->language(app()->getLocale());

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['search']}%")
                    ->orWhere('content', 'like', "%{$filters['search']}%");
            });
        }

        match (Arr::get($filters, 'sort')) {
            'oldest' => $query->oldest('published_at'),
            'title_asc' => $query->orderBy('title', 'asc'),
            'title_desc' => $query->orderBy('title', 'desc'),
            default => $query->latest('published_at'),
        };

        $paginator = $query->paginate(6);
        $paginator->appends($filters);

        return $paginator;
    }

    public function getFeaturedArticles(string $locale = 'en')
    {
        return Cache::tags('posts')->rememberForever('featured.articles.'.$locale, function () use ($locale) {
            return Post::latest('published_at')
                ->with(['tags'])
                ->withCount('comments')
                ->language($locale)
                ->published()
                ->take(4)
                ->get();
        });
    }
}
