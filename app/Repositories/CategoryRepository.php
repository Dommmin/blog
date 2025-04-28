<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function getAll(): Collection
    {
        return Cache::tags('categories')->rememberForever('categories.all', function () {
            return Category::all();
        });
    }

    public function getForSelect(): Collection
    {
        return Cache::tags('categories')->rememberForever('categories.select', function () {
            return Category::get(['id', 'name']);
        });
    }

    public function find(int $id): ?Category
    {
        return Cache::tags('categories')->rememberForever('category.'.$id, function () use ($id) {
            return Category::find($id);
        });
    }

    public function create(array $data): Category
    {
        $category = Category::create($data);
        Cache::tags('categories')->flush();

        return $category;
    }

    public function update(Category $category, array $data): Category
    {
        $category->update($data);
        Cache::tags('categories')->flush();

        return $category;
    }

    public function delete(Category $category): bool
    {
        $result = $category->delete();
        Cache::tags('categories')->flush();

        return $result;
    }
}
