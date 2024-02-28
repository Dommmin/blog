<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\PostView;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostViewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $chunkSize = 1000;
        $timestamp = now();
        $posts = Post::inRandomOrder()->limit(10)->pluck('id');
        $postCount = $posts->count();

        for ($i = 0; $i < 500000; $i += $chunkSize) {
            $data = [];

            for ($j = 0; $j < min($chunkSize, 500000 - $i); $j++) {
                $data[] = [
                    'ip_address' => fake()->ipv4(),
                    'post_id'    => $posts[rand(0, $postCount - 1)],
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ];
            }

            PostView::insert($data);
            unset($data);
        }
    }
}
