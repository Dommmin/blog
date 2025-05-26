<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PostVisit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __invoke(Request $request)
    {
        return Inertia::render('Admin/home', [
            'visitStats' => PostVisit::getStats(),
        ]);
    }
}
