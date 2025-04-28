<?php

namespace App\Services;

use App\Models\Post;
use App\Repositories\Contracts\PostRepositoryInterface;

class PostService
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository
    ) {}

    public function getPaginatedPosts(int $perPage = 10)
    {
        return $this->postRepository->getPaginated($perPage);
    }

    public function findPost(string $slug): ?Post
    {
        return $this->postRepository->find($slug);
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
        }

        return $post;
    }

    public function deletePost(Post $post): bool
    {
        return $this->postRepository->delete($post);
    }
}
