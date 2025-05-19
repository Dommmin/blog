<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\NewsletterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Health check endpoint
Route::get('/up', fn () => 'OK');
Route::get('/{any}', function ($any = '') {
    return redirect(app()->getLocale().'/'.$any);
})->where('any', '^(?!admin|login|register|forgot-password|verify-email|reset-password|confirm-password|('.implode('|', available_locales()).')).*$');

Route::group(['prefix' => '{locale}', 'where' => ['locale' => '[a-zA-Z]{2}'], 'middleware' => 'web'], function () {
    Route::get('/', HomeController::class)->name('home');
    Route::post('/locale', [LocaleController::class, 'change'])->name('locale.change');
    Route::get('/about', AboutController::class)->name('about');
    Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
    Route::get('/blog/{post}', [BlogController::class, 'show'])->name('blog.show');

    Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');
    Route::get('/newsletter/confirm/{token}', [NewsletterController::class, 'confirm'])->name('newsletter.confirm');

    Route::post('/blog/{post}/comments', [CommentController::class, 'store'])
        ->middleware('auth')
        ->name('blog.comments.store');

    require __DIR__.'/settings.php';
});

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';

Route::fallback(function () {
    return Inertia::render('Errors/404');
});
