<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class PostTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = Tag::pluck('id')->toArray();

        Post::each(function (Post $post) use ($tags) {
            $tags = Arr::random($tags, random_int(1, 3));

            $post->tags()->attach($tags);
        });
    }
}
