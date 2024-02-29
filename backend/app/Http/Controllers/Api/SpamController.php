<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Spam;
use Illuminate\Http\Request;

class SpamController extends Controller
{
    public function __invoke(Request $request)
    {
        match (true) {
            $request->has('post_id') => $this->markAsSpam($request, Post::class, $request->post_id),
            $request->has('comment_id') => $this->markAsSpam($request, Comment::class, $request->comment_id),
            default => abort(404),
        };

        return response()->noContent();
    }

    private function markAsSpam(Request $request, $model, $spamable_id): void
    {
        Spam::createOrFirst([
            'user_id' => auth()->id(),
            'spamable_type' => $model,
            'spamable_id' => $spamable_id,
            'reason' => $request->reason,
        ]);
    }
}
