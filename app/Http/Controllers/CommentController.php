<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
    public function store(StoreCommentRequest $request, string $locale): RedirectResponse
    {
        Comment::create($request->validated() + ['user_id' => auth()->id()]);

        return back()->with('success', 'Comment added successfully!');
    }
}
