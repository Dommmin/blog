<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTagRequest;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function index(Request $request): Response
    {
        $page = $request->get('page', 1);

        $tags = Cache::tags('tags')->rememberForever('admin.tags.index.'.$page, function () {
            return Tag::query()
                ->latest('created_at')
                ->paginate(10);
        });

        return Inertia::render('Admin/Tags/Index', [
            'tags' => $tags,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Tags/Create');
    }

    public function store(StoreTagRequest $request): RedirectResponse
    {
        Tag::create($request->validated());

        return to_route('admin.tags.index')->with('success', 'Tag created successfully');
    }

    public function edit(string $locale, Tag $tag): Response
    {
        return Inertia::render('Admin/Tags/Edit', [
            'tag' => $tag,
        ]);
    }

    public function update(StoreTagRequest $request, Tag $tag): RedirectResponse
    {
        $tag->update($request->validated());

        return to_route('admin.tags.index')->with('success', 'Tag updated successfully');
    }

    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->delete();

        return to_route('admin.tags.index')->with('success', 'Tag deleted successfully');
    }
}
