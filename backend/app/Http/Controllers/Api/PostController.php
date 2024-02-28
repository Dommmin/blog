<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Jobs\ProcessViewCount;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $posts = Post::query()
            ->when($request->has('search'), function ($query) use ($request) {
                $query
                    ->where('title', 'like', '%' . $request->get('search') . '%')
                    ->orWhere('body', 'like', '%' . $request->get('search') . '%');
            })
            ->withCount(['comments', 'votes', 'views'])
            ->with('user:id,name', 'isVotedByUser')
            ->latest('id')
            ->simplePaginate(20);

        return PostResource::collection($posts);
    }

    public function store(StorePostRequest $request)
    {
        $validatedData = $request->validated();

        if ($request->file('thumbnail')) {
            $path = $request->file('thumbnail')->store('images', 'public');
            $validatedData['thumbnail'] = Storage::disk('public')->url($path);
        }

        $validatedData['user_id'] = auth()->id();

        return Post::create($validatedData);
    }

    public function show(Post $post)
    {
        $userId = auth()->id();
        $ipAddress = request()->ip();

        ProcessViewCount::dispatch($post, $userId, $ipAddress);

        $data = $post
            ->load('user:id,name', 'isVotedByUser')
            ->loadCount('votes', 'views');

        return new PostResource($data);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('update', $post);

        $validatedData = $request->validated();

        if ($request->file('thumbnail')) {
            $path = $request->file('thumbnail')->store('images', 'public');
            $validatedData['thumbnail'] = Storage::disk('public')->url($path);
        }

        return $post->update($validatedData);
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return response()->noContent();
    }

    public function mostViewed()
    {
        $posts = Post::query()
            ->withCount('votes', 'views')
            ->with('user:id,name', 'isVotedByUser')
            ->orderBy('views_count', 'desc')
            ->limit(5)
            ->get();

        return PostResource::collection($posts);
    }

    public function topVoted()
    {
        $posts = Post::query()
            ->withCount('votes', 'views')
            ->with('user:id,name', 'isVotedByUser')
            ->orderBy('votes_count', 'desc')
            ->limit(5)
            ->get();

        return PostResource::collection($posts);
    }
}
