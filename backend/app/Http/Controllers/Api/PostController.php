<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Jobs\ProcessViewCount;
use App\Models\Post;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::getProducts();

        return PostResource::collection($posts);
    }

    public function store(StorePostRequest $request)
    {
        $validatedData = $request->validated();
        unset($validatedData['tags']);

        if ($request->file('thumbnail')) {
            $path = $request->file('thumbnail')->store('images', 'public');
            $validatedData['thumbnail'] = Storage::disk('public')->url($path);
        }

        $validatedData['user_id'] = auth()->id();

        $post = Post::create($validatedData);

        foreach ($request->tags as $tag) {
            $post->tags()->attach($tag);
        }

        return new PostResource($post);
    }

    public function show(Post $post)
    {
        $userId = auth()->id();
        $ipAddress = request()->ip();

        ProcessViewCount::dispatch($post, $userId, $ipAddress);

        $data = $post
            ->load('user:id,name', 'isVotedByUser', 'tags:id,name')
            ->loadCount('votes', 'views');

        return new PostResource($data);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('update', $post);

        $validatedData = $request->validated();
        unset($validatedData['tags']);

        if ($request->file('thumbnail')) {
            $path = $request->file('thumbnail')->store('images', 'public');
            $validatedData['thumbnail'] = Storage::disk('public')->url($path);
        }

        $post->tags()->sync($request->tags);
        $post->update($validatedData);

        return $post;
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
