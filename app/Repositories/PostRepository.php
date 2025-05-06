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

    public function find(string $slug): ?Post
    {
        return Cache::tags('posts')->rememberForever('post.'.$slug, function () use ($slug) {
            return Post::where('slug', $slug)->first();
        });
    }

    public function create(array $data): Post
    {
        $post = Post::create($data);
        Cache::tags('posts')->flush();

        return $post;
    }

    public function update(Post $post, array $data): Post
    {
        $post->update($data);
        Cache::tags('posts')->flush();

        return $post;
    }

    public function delete(Post $post): bool
    {
        $result = $post->delete();
        Cache::tags('posts')->flush();

        return $result;
    }

    public function syncTags(Post $post, array $tagIds): void
    {
        $post->tags()->sync($tagIds);
        Cache::tags('posts')->flush();
    }

    public function getPostsForBlog(int $page): LengthAwarePaginator
    {
        return Cache::tags('posts')->rememberForever('blog.index.posts.'.$page, function () {
            return Post::published()
                ->with(['category'])
                ->latest('published_at')
                ->paginate(6)
                ->withQueryString();
        });
    }
}
