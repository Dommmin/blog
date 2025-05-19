<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use App\Services\CategoryService;
use App\Services\PostService;
use App\Services\TagService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function __construct(
        private readonly PostService $postService,
        private readonly TagService $tagService,
        private readonly CategoryService $categoryService
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Posts/Index', [
            'posts' => $this->postService->getPaginatedPosts(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Posts/Create', [
            'categories' => $this->categoryService->getCategoriesForSelect(),
            'tags' => $this->tagService->getTagsForSelect(),
        ]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $data = array_merge($request->validated(), ['user_id' => auth()->id()]);
        $this->postService->createPost($data);

        return to_route('admin.posts.index')->with('success', 'Post created successfully');
    }

    public function edit(string $locale, Post $post): Response
    {
        return Inertia::render('Admin/Posts/Edit', [
            'post' => $post->load('tags'),
            'categories' => $this->categoryService->getCategoriesForSelect(),
            'tags' => $this->tagService->getTagsForSelect(),
        ]);
    }

    public function update(UpdatePostRequest $request, string $locale, Post $post): RedirectResponse
    {
        $this->postService->updatePost($post, $request->validated());

        return to_route('admin.posts.index', ['locale' => $locale])->with('success', 'Post updated successfully');
    }

    public function destroy(string $locale, Post $post): RedirectResponse
    {
        $this->postService->deletePost($post);

        return to_route('admin.posts.index', ['locale' => $locale])->with('success', 'Post deleted successfully');
    }
}
