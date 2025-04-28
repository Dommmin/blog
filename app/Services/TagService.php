<?php

namespace App\Services;

use App\Models\Tag;
use App\Repositories\Contracts\TagRepositoryInterface;

class TagService
{
    public function __construct(
        private readonly TagRepositoryInterface $tagRepository
    ) {}

    public function getAllTags()
    {
        return $this->tagRepository->getAll();
    }

    public function getTagsForSelect()
    {
        return $this->tagRepository->getForSelect();
    }

    public function findTag(int $id): ?Tag
    {
        return $this->tagRepository->find($id);
    }

    public function createTag(array $data): Tag
    {
        return $this->tagRepository->create($data);
    }

    public function updateTag(Tag $tag, array $data): Tag
    {
        return $this->tagRepository->update($tag, $data);
    }

    public function deleteTag(Tag $tag): bool
    {
        return $this->tagRepository->delete($tag);
    }
}
