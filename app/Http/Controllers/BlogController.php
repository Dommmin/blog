<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->get('page', 1);

        $posts = Cache::tags('posts')->rememberForever('blog.index.posts.'.$page, function () {
            return Post::published()
                ->with('author')
                ->latest('published_at')
                ->paginate(12);
        });

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
        ]);
    }

    public function show(Request $request, Post $post)
    {
        if (! Gate::allows('view', $post)) {
            abort(404);
        }

        $post = Cache::tags('posts')->rememberForever('post.'.$post->slug, function () use ($post) {
            return $post->load('author');
        });

        return Inertia::render('Blog/Show', [
            'post' => $post,
        ]);
    }
}
