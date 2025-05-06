<?php

namespace App\Repositories;

use App\Models\Comment;
use App\Models\Post;
use App\Repositories\Contracts\CommentRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class CommentRepository implements CommentRepositoryInterface
{
    public function getPaginatedForPost(Post $post): LengthAwarePaginator
    {
        return Cache::tags('comments')->rememberForever('comments.'.request()->get('page', 1), function () {
            return Comment::query()
                ->with(['author'])
                ->latest('created_at')
                ->paginate(10);
        });
    }

    public function create(array $data): Comment
    {
        return Comment::create($data);
    }

    public function update(Comment $post, array $data): Comment
    {
        $post->update($data);

        return $post;
    }

    public function delete(Comment $comment): bool
    {
        return $comment->delete();
    }
}
