<?php

use App\Http\Controllers\Admin\HomeController;
use App\Http\Controllers\Admin\PostController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin|editor'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', HomeController::class)->name('home');
    Route::resource('posts', PostController::class);
});
