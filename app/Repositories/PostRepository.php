<?php

namespace App\Repositories;

use App\Models\Post;
use App\Repositories\Contracts\PostRepositoryInterface;
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
                ->withCount('comments')
                ->first();
        });
    }

    public function create(array $data): Post
    {
        $post = Post::create($data);
        Post::flush();

        return $post;
    }

    public function update(Post $post, array $data): Post
    {
        $post->update($data);
        Post::flush();

        return $post;
    }

    public function delete(Post $post): bool
    {
        $result = $post->delete();
        Post::flush();

        return $result;
    }

    public function syncTags(Post $post, array $tagIds): void
    {
        $post->tags()->sync($tagIds);
        Post::flush();
    }

    public function getPostsForBlog(array $filters): LengthAwarePaginator
    {
        $query = Post::query()
            ->with(['author', 'category', 'tags'])
            ->published()
            ->language(app()->getLocale());

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['search']}%")
                    ->orWhere('content', 'like', "%{$filters['search']}%");
            });
        }

        if (isset($filters['sort'])) {
            match ($filters['sort']) {
                'latest' => $query->latest('published_at'),
                'oldest' => $query->oldest('published_at'),
                'title_asc' => $query->orderBy('title', 'asc'),
                'title_desc' => $query->orderBy('title', 'desc'),
                default => $query->latest('published_at'),
            };
        } else {
            $query->latest('published_at');
        }

        return $query->paginate(6);
    }

    public function getFeaturedArticles()
    {
        return Cache::tags('posts')->rememberForever('featured.articles', function () {
            return Post::latest('published_at')
                ->with(['category', 'tags'])
                ->withCount('comments')
                ->published()
                ->take(4)
                ->get();
        });
    }
}
