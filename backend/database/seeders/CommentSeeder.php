<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $chunkSize = 1000;
        $timestamp = now();
        $usersCount = User::count();
        $postsCount = Post::count();

        for ($i = 0; $i < 10000; $i += $chunkSize) {
            $data = [];

            for ($j = 0; $j < min($chunkSize, 10000 - $i); $j++) {
                $data[] = [
                    'post_id'    => rand(1, $postsCount),
                    'user_id'    => rand(1, $usersCount),
                    'body'       => fake()->paragraph(),
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ];
            }

            Comment::insert($data);
            unset($data);
        }
    }
}
