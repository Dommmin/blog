<?php

namespace App\Services;

use App\Models\File;
use App\Repositories\Contracts\FileRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileService
{
    public function __construct(
        private readonly FileRepositoryInterface $fileRepository
    ) {}

    public function getPaginated(int $perPage = 20): LengthAwarePaginator
    {
        return $this->fileRepository->getPaginated($perPage);
    }

    public function store(UploadedFile $file): File
    {
        $fileName = Str::uuid().'.'.$file->getClientOriginalExtension();
        $data = [
            'name' => $fileName,
            'path' => Storage::disk('public')->putFileAs('files', $file, $fileName),
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'extension' => $file->getClientOriginalExtension(),
        ];

        return $this->fileRepository->create($data);
    }

    public function delete(File $file): bool
    {
        $this->fileRepository->delete($file);

        return Storage::disk('public')->delete($file->path);
    }
}
