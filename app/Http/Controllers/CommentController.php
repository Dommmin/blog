<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
    public function store(StoreCommentRequest $request, string $locale): RedirectResponse
    {
        Comment::create($request->validated() + ['user_id' => auth()->id()]);

        return back()->with('success', 'Comment added successfully!');
    }

    public function destroy(string $locale, Post $post, Comment $comment)
    {
        $comment->delete();

        return back()->with('success', __('Comment deleted successfully!'));
    }
}
