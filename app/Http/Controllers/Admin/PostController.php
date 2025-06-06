<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use App\Services\CategoryService;
use App\Services\FileService;
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
        private readonly CategoryService $categoryService,
        private readonly FileService $fileService
    ) {}

    public function index(Request $request): Response
    {
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $language = $request->get('language');

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $this->postService->getPaginatedPosts(
                sortBy: $sortBy,
                sortDirection: $sortDirection,
                language: $language
            ),
            'filters' => [
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
                'language' => $language,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Posts/Create', [
            'categories' => $this->categoryService->getCategoriesForSelect(),
            'tags' => $this->tagService->getTagsForSelect(),
            'files' => $this->fileService->getPaginated(20),
        ]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $this->postService->createPost($request->validated());

        return to_route('admin.posts.index')->with('success', __('Post created successfully'));
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('Admin/Posts/Edit', [
            'post' => $this->postService->getPostForEdit($post),
            'categories' => $this->categoryService->getCategoriesForSelect(),
            'tags' => $this->tagService->getTagsForSelect(),
            'files' => $this->fileService->getPaginated(20),
        ]);
    }

    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $this->postService->updatePost($post, $request->validated());

        return to_route('admin.posts.index')->with('success', __('Post updated successfully'));
    }

    public function destroy(Post $post): RedirectResponse
    {
        $this->postService->deletePost($post);

        return to_route('admin.posts.index')->with('success', __('Post deleted successfully'));
    }
}
