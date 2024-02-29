<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Post::factory(100)->create();

        Post::cursor()->each(function (Post $post): void {
            $tagIds = Tag::inRandomOrder()->take(3)->pluck('id')->toArray();
            $post->tags()->attach($tagIds);
        });
    }
}
