<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\FileController;
use App\Http\Controllers\Admin\HomeController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\PostVisitController;
use App\Http\Controllers\Admin\SubscriberController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', HomeController::class)->name('home');
    Route::resource('categories', CategoryController::class)->names([
        'index' => 'categories.index',
        'create' => 'categories.create',
        'store' => 'categories.store',
        'edit' => 'categories.edit',
        'update' => 'categories.update',
        'destroy' => 'categories.destroy',
    ]);
    Route::resource('posts', PostController::class)->names([
        'index' => 'posts.index',
        'create' => 'posts.create',
        'store' => 'posts.store',
        'edit' => 'posts.edit',
        'update' => 'posts.update',
        'destroy' => 'posts.destroy',
    ]);
    Route::resource('tags', TagController::class)->names([
        'index' => 'tags.index',
        'create' => 'tags.create',
        'store' => 'tags.store',
        'edit' => 'tags.edit',
        'update' => 'tags.update',
        'destroy' => 'tags.destroy',
    ]);
    Route::resource('users', UserController::class)->names([
        'index' => 'users.index',
        'create' => 'users.create',
        'store' => 'users.store',
        'edit' => 'users.edit',
        'update' => 'users.update',
        'destroy' => 'users.destroy',
    ]);
    Route::resource('subscribers', SubscriberController::class)->names([
        'index' => 'subscribers.index',
    ])->only(['index']);
    Route::resource('visits', PostVisitController::class)->names([
        'index' => 'visits.index',
    ]);
    Route::resource('files', FileController::class)->names([
        'index' => 'files.index',
        'store' => 'files.store',
        'destroy' => 'files.destroy',
    ])->only(['index', 'store', 'destroy']);
});
