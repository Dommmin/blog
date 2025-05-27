<?php

namespace App\Repositories\Contracts;

use App\Models\File;
use Illuminate\Pagination\LengthAwarePaginator;

interface FileRepositoryInterface
{
    public function getPaginated(int $perPage = 20): LengthAwarePaginator;
    public function create(array $data): File;
    public function delete(File $file): bool;
    public function find(int $id): ?File;
}
