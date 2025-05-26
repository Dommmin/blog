<?php

namespace App\Http\Middleware;

use App\Jobs\RecordPostVisit;
use App\Models\Post;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackPostViews
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($request->route() && $request->route()->getName() === 'blog.show') {
            $post = $request->route('post');

            if ($post instanceof Post) {
                RecordPostVisit::dispatch(
                    $post->id,
                    $request->user()?->id,
                    $request->ip()
                );
            }
        }

        return $response;
    }
}
