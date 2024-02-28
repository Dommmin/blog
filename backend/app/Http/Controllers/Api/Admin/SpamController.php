<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Spam;
use Illuminate\Http\Request;

class SpamController extends Controller
{
    public function index()
    {
        return Spam::with('spamable:id', 'user:id,name')->get();
    }
}
