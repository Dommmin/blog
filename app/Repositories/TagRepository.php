<?php

namespace App\Repositories;

use App\Models\Tag;
use App\Repositories\Contracts\TagRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class TagRepository implements TagRepositoryInterface
{
    public function getAll(): Collection
    {
        return Cache::tags('tags')->rememberForever('tags.all', function () {
            return Tag::all();
        });
    }

    public function getForSelect(): Collection
    {
        return Cache::tags('tags')->rememberForever('tags.select', function () {
            return Tag::get(['id', 'name'])->map(function ($tag) {
                return [
                    'label' => $tag->name,
                    'value' => $tag->id,
                ];
            });
        });
    }

    public function find(int $id): ?Tag
    {
        return Cache::tags('tags')->rememberForever('tag.'.$id, function () use ($id) {
            return Tag::find($id);
        });
    }

    public function create(array $data): Tag
    {
        $tag = Tag::create($data);
        Cache::tags('tags')->flush();

        return $tag;
    }

    public function update(Tag $tag, array $data): Tag
    {
        $tag->update($data);
        Cache::tags('tags')->flush();

        return $tag;
    }

    public function delete(Tag $tag): bool
    {
        $result = $tag->delete();
        Cache::tags('tags')->flush();

        return $result;
    }
}
