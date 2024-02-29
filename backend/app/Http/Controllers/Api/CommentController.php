<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $comments = Comment::query()
            ->when($request->has('post_id'), function ($query) use ($request): void {
                $query->where('post_id', $request->get('post_id'));
            })
            ->simplePaginate(10);

        return CommentResource::collection($comments);
    }

    public function store(StoreCommentRequest $request)
    {
        return Comment::create($request->validated() + ['user_id' => auth()->id()]);
    }

    public function update(UpdateCommentRequest $request, Comment $comment)
    {
        $this->authorize('update', $comment);

        return $comment->update($request->validated());
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->noContent();
    }
}
