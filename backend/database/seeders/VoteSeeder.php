<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function (): void {
            $chunkSize = 1000;
            $timestamp = now();

            User::chunk($chunkSize, function ($users) use ($chunkSize, $timestamp): void {
                foreach ($users as $user) {
                    Post::chunk($chunkSize, function ($posts) use ($user, $timestamp): void {
                        $votes = [];

                        foreach ($posts as $post) {
                            $votes[] = [
                                'user_id' => $user->id,
                                'post_id' => $post->id,
                                'created_at' => $timestamp,
                                'updated_at' => $timestamp,
                            ];
                        }

                        Vote::insert($votes);
                        unset($votes);
                    });
                }
            });
        });
    }
}
