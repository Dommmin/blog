<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request, string $locale): Response
    {
        $page = $request->get('page', 1);

        $categories = Cache::tags('categories')->rememberForever('admin.categories.index.'.$locale.'.'.$page, function () {
            return Category::query()
                ->latest('created_at')
                ->paginate(10);
        });

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create(string $locale): Response
    {
        return Inertia::render('Admin/Categories/Create');
    }

    public function store(StoreCategoryRequest $request, string $locale): RedirectResponse
    {
        Category::create($request->validated());

        return to_route('admin.categories.index', ['locale' => $locale])->with('success', __('Category created successfully'));
    }

    public function edit(string $locale, Category $category): Response
    {
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(StoreCategoryRequest $request, string $locale, Category $category): RedirectResponse
    {
        $category->update($request->validated());

        return to_route('admin.categories.index', ['locale' => $locale])->with('success', __('Category updated successfully'));
    }

    public function destroy(string $locale, Category $category): RedirectResponse
    {
        $category->delete();

        return to_route('admin.categories.index', ['locale' => $locale])->with('success', __('Category deleted successfully'));
    }
}
