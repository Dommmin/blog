<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PostVisit;
use Inertia\Inertia;

class PostVisitController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/PostVisit/Index', [
            'visits' => PostVisit::with(['post', 'user'])->paginate(10),
        ]);
    }
}
