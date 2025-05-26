<?php

namespace App\Http\Controllers;

use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __construct(
        private readonly SeoService $seoService
    ) {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        return Inertia::render('About', [
            'seo' => $this->seoService->getAboutSeoData(),
        ]);
    }
}
