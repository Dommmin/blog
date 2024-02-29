<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bookmark;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    public function index()
    {
        return Bookmark::query()
            ->where('user_id', auth()->id())
            ->with('post:id,title,thumbnail')
            ->get();
    }

    public function store(Request $request)
    {
        return Bookmark::create([
            'user_id' => auth()->id(),
            'post_id' => $request->post_id,
        ]);
    }

    public function destroy(Bookmark $bookmark)
    {
        $bookmark->delete();

        return response()->noContent();
    }
}
