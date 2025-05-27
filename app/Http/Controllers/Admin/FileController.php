<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFileRequest;
use App\Models\File;
use App\Services\FileService;
use Inertia\Inertia;

class FileController extends Controller
{
    public function __construct(
        private readonly FileService $fileService
    ) {}

    public function index()
    {
        return Inertia::render('Admin/Files/Index', [
            'files' => $this->fileService->getPaginated(20),
        ]);
    }

    public function store(StoreFileRequest $request)
    {
        $data = $request->validated();
        $this->fileService->store($data['file']);

        return back()->with('success', 'File created successfully');
    }

    public function destroy(File $file)
    {
        $this->fileService->delete($file);

        return back()->with('success', 'File deleted successfully');
    }
}
