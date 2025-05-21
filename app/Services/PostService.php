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

        // Generate translation key for new posts
        if (!isset($data['translation_key'])) {
            $data['translation_key'] = Str::uuid()->toString();
        }

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

    public function getAvailableTranslations(Post $post): array
    {
        $translations = $post->translations()->get();
        $result = [
            $post->language => [
                'slug' => $post->slug,
                'title' => $post->title,
            ]
        ];

        foreach ($translations as $translation) {
            $result[$translation->language] = [
                'slug' => $translation->slug,
                'title' => $translation->title,
            ];
        }

        return $result;
    }
}
