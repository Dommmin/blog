<?php

namespace App\Http\Controllers;

use App\Http\Requests\IndexBlogRequest;
use App\Models\Post;
use App\Repositories\CommentRepository;
use App\Repositories\PostRepository;
use App\Services\PostService;
use App\Services\SeoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function __construct(
        private readonly PostRepository $repository,
        private readonly CommentRepository $commentRepository,
        private readonly PostService $postService,
        private readonly SeoService $seoService
    ) {}

    public function index(IndexBlogRequest $request): Response
    {
        $filters = $request->validated();

        return Inertia::render('Blog/Index', [
            'posts' => $this->repository->getPostsForBlog($filters),
            'filters' => $filters,
            'seo' => $this->seoService->getBlogIndexSeoData(),
        ]);
    }

    public function show(Request $request, string $locale, Post $post): Response|RedirectResponse
    {
        if (! Gate::allows('view', $post)) {
            abort(404);
        }

        if ($post->language !== $locale) {
            $translation = $post->getTranslation($locale);
            if ($translation) {
                return redirect()->route('blog.show', ['post' => $translation->slug, 'locale' => $locale]);
            }

            return redirect()->route('blog.index', ['locale' => $locale]);
        }

        return Inertia::render('Blog/Show', [
            'post' => $this->repository->find($post->slug, $locale),
            'comments' => $this->commentRepository->getPaginatedForPost($post),
            'translations' => $this->postService->getAvailableTranslations($post),
            'seo' => $this->seoService->getPostSeoData($post),
        ]);
    }

    public function suggestPosts(Request $request): JsonResponse
    {
        $query = $request->input('query');

        if (trim($query) === '') {
            return response()->json([]);
        }

        $results = Post::getSuggestions($query);

        return response()->json($results);
    }
}
