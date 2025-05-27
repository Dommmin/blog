<?php

namespace App\Repositories;

use App\Models\File;
use App\Repositories\Contracts\FileRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class FileRepository implements FileRepositoryInterface
{
    public function getPaginated(int $perPage = 20): LengthAwarePaginator
    {
        return File::orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function create(array $data): File
    {
        return File::create($data);
    }

    public function delete(File $file): bool
    {
        return $file->delete();
    }

    public function find(int $id): ?File
    {
        return File::find($id);
    }
}