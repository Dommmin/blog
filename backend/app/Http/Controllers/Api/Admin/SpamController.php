<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Spam;

class SpamController extends Controller
{
    public function index()
    {
        return Spam::with('spamable:id', 'user:id,name')->get();
    }
}
