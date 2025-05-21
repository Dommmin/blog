<?php

namespace App\Services;

use App\Models\Post;
use App\Repositories\Contracts\PostRepositoryInterface;
use Illuminate\Support\Str;

class PostService
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository
    ) {}

    public function getPaginatedPosts(int $perPage = 10)
    {
        return $this->postRepository->getPaginated($perPage);
    }

    public function findPost(string $slug, string $language = 'en'): ?Post
    {
        return $this->postRepository->find($slug, $language);
    }

    public function createPost(array $data): Post
    {
        $tags = $data['tags'] ?? [];
        unset($data['tags']);

        $post = $this->postRepository->create($data);

        if (! empty($tags)) {
            $this->postRepository->syncTags($post, $tags);
        }

        return $post;
    }

    public function updatePost(Post $post, array $data): Post
    {
        $tags = $data['tags'] ?? [];
        unset($data['tags']);

        $post = $this->postRepository->update($post, $data);

        if (! empty($tags)) {
            $this->postRepository->syncTags($post, $tags);
            $post->flush();
        }

        return $post;
    }

    public function deletePost(Post $post): bool
    {
        return $this->postRepository->delete($post);
    }

    /**
     * Get available translations for a post.
     *
     * @return array<array{language: string, slug: string, title: string}>
     */
    public function getAvailableTranslations(Post $post): array
    {
        return Post::where('translation_key', $post->translation_key)
            ->where('id', '!=', $post->id)
            ->get(['language', 'slug', 'title'])
            ->map(fn (Post $translation) => [
                'language' => $translation->language,
                'slug' => $translation->slug,
                'title' => $translation->title,
            ])
            ->toArray();
    }
}
