<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Post::factory(100)->create();

        Post::cursor()->each(function (Post $post) {
            $tagIds = Tag::inRandomOrder()->take(3)->pluck('id')->toArray();
            $post->tags()->attach($tagIds);
        });
    }
}
