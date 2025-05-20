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
        return Cache::tags('posts')->rememberForever('admin.posts.index.' . request()->get('page', 1), function () use ($perPage) {
            return Post::query()
                ->with('author')
                ->latest('created_at')
                ->paginate($perPage);
        });
    }

    public function find(string $slug): ?Post
    {
        return Cache::tags('posts')->rememberForever('post.' . $slug, function () use ($slug) {
            return Post::where('slug', $slug)
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
        $search = $filters['search'] ?? null;
        $sort = $filters['sort'] ?? 'latest';
        $perPage = 6;

        $query = Post::published()
            ->with(['category', 'tags'])
            ->withCount('comments');

        if ($search && config('scout.enabled')) {
            $ids = Post::search($search)->get()->pluck('id');
            $query = $query->whereIn('id', $ids);
        }

        $query = match ($sort) {
            'oldest' => $query->orderBy('published_at', 'asc'),
            'title_asc' => $query->orderBy('title', 'asc'),
            'title_desc' => $query->orderBy('title', 'desc'),
            default => $query->orderBy('published_at', 'desc'),
        };

        return $query->paginate($perPage)->withQueryString();
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
