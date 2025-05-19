<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\HomeController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\TagController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin|editor'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/admin', fn() => redirect(app()->getLocale()));
    Route::group(['prefix' => '{locale}', 'where' => ['locale' => '[a-zA-Z]{2}']], function () {
        Route::get('/', HomeController::class)->name('home');
        Route::resource('categories', CategoryController::class)->names([
            'index' => 'categories.index',
        ]);
        Route::resource('posts', PostController::class)->names([
            'index' => 'posts.index',
        ]);
        Route::resource('tags', TagController::class)->names([
            'index' => 'tags.index',
        ]);
    });
});
