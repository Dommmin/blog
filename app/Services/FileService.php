<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use App\Models\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Repositories\Contracts\FileRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

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
        $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
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
