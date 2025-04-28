<?php

namespace App\Repositories\Contracts;

use App\Models\Tag;
use Illuminate\Support\Collection;

interface TagRepositoryInterface
{
    public function getAll(): Collection;

    public function getForSelect(): Collection;

    public function find(int $id): ?Tag;

    public function create(array $data): Tag;

    public function update(Tag $tag, array $data): Tag;

    public function delete(Tag $tag): bool;
}
