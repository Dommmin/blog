<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $page = $request->get('page', 1);

        $posts = Cache::tags('posts')->rememberForever('admin.posts.index.'.$page, function () {
            return Post::query()
                ->with('author')
                ->latest('published_at')
                ->paginate(10);
        });

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Posts/Create');
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $data = $request->validated();

        Post::create(array_merge(
            $data,
            ['user_id' => auth()->id()]
        ));

        return to_route('admin.posts.index')->with('success', 'Post created successfully');
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('Admin/Posts/Edit', [
            'post' => $post,
        ]);
    }

    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $data = $request->validated();
        $post->update($data);

        return to_route('admin.posts.index')->with('success', 'Post updated successfully');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return to_route('admin.posts.index')->with('success', 'Post deleted successfully');
    }
}
