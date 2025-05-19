<?php

namespace App\Http\Controllers;

use App\Repositories\PostRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __construct(private readonly PostRepository $repository) {}

    public function __invoke(Request $request, ?string $locale)
    {
        return Inertia::render('home', [
            'posts' => $this->repository->getFeaturedArticles(),
        ]);
    }
}
