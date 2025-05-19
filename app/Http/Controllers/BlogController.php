<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Repositories\CommentRepository;
use App\Repositories\PostRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function __construct(private readonly PostRepository $repository, private readonly CommentRepository $commentRepository) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'sort']);

        return Inertia::render('Blog/Index', [
            'posts' => $this->repository->getPostsForBlog($filters),
        ]);
    }

    public function show(Request $request, string $locale, Post $post)
    {
        if (! Gate::allows('view', $post)) {
            abort(404);
        }

        return Inertia::render('Blog/Show', [
            'post' => $this->repository->find($post->slug),
            'comments' => $this->commentRepository->getPaginatedForPost($post),
        ]);
    }

    public function suggestPosts(Request $request)
    {
        $query = $request->input('query');

        if (! $query || ! config('scout.enabled')) {
            return response()->json([]);
        }

        $results = Post::getSuggestions($query);

        return response()->json($results);
    }
}
