<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Api\BookmarkController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\SpamController;
use App\Http\Controllers\Api\VoteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', fn (Request $request) => $request->user());

Route::get('search', SearchController::class);
Route::get('most-viewed', [PostController::class, 'mostViewed']);
Route::get('top-voted', [PostController::class, 'topVoted']);
Route::apiResource('posts', PostController::class)->only('index', 'show');
Route::apiResource('comments', CommentController::class)->only('index');

Route::post('mark-as-spam', SpamController::class);
Route::middleware('auth:sanctum')->group(function (): void {
    Route::apiResource('posts', PostController::class)->except('index', 'show');
    Route::apiResource('comments', CommentController::class)->only('store', 'update', 'destroy');
    Route::apiResource('votes', VoteController::class)->only('store', 'destroy');
    Route::apiResource('bookmarks', BookmarkController::class)->only('index', 'store', 'destroy');
});

Route::middleware('admin')->prefix('admin')->group(function (): void {
    Route::apiResource('spams', Admin\SpamController::class);
});
