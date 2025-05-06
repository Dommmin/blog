<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Repositories\PostRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function __construct(private readonly PostRepository $repository) {}

    public function index(Request $request)
    {
        $page = $request->get('page', 1);

        return Inertia::render('Blog/Index', [
            'posts' => $this->repository->getPostsForBlog($page),
        ]);
    }

    public function show(Request $request, Post $post)
    {
        if (! Gate::allows('view', $post)) {
            abort(404);
        }

        return Inertia::render('Blog/Show', [
            'post' => $this->repository->find($post->slug),
        ]);
    }
}
