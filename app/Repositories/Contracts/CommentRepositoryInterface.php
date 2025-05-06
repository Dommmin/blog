<?php

namespace App\Repositories\Contracts;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Pagination\LengthAwarePaginator;

interface CommentRepositoryInterface
{
    public function getPaginatedForPost(Post $post): LengthAwarePaginator;

    public function create(array $data): Comment;

    public function update(Comment $post, array $data): Comment;

    public function delete(Comment $post): bool;
}
