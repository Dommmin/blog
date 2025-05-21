<?php

namespace App\Repositories\Contracts;

use App\Models\Post;
use Illuminate\Pagination\LengthAwarePaginator;

interface PostRepositoryInterface
{
    public function getPaginated(int $perPage = 10): LengthAwarePaginator;

    public function find(string $slug, string $language = 'en'): ?Post;

    public function create(array $data): Post;

    public function update(Post $post, array $data): Post;

    public function delete(Post $post): bool;

    public function syncTags(Post $post, array $tagIds): void;

    public function getPostsForBlog(array $filters): LengthAwarePaginator;
}
