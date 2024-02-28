<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $chunkSize = 1000;
            $timestamp = now();

            User::chunk($chunkSize, function ($users) use ($chunkSize, $timestamp) {
                foreach ($users as $user) {
                    Post::chunk($chunkSize, function ($posts) use ($user, $timestamp) {
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
