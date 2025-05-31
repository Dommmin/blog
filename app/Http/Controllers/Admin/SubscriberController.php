<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriberController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Subscribers/Index', [
            'subscribers' => NewsletterSubscriber::paginate(10),
        ]);
    }
}
