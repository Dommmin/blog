<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return Inertia::render('home', [
            'posts' => Post::latest('published_at')
                ->with(['category'])
                ->published()
                ->take(4)
                ->get(),
        ]);
    }
}
