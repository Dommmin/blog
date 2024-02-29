<?php

namespace Tests\Feature;

use App\Models\Tag;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Post;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_returns_posts_list(): void
    {
        User::factory()->create();
        $tag = Tag::factory()->create();
        $post = Post::factory()->create();
        $post->tags()->attach($tag);

        $response = $this->get('/api/posts');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [],
            'links' => [],
            'meta' => [],
        ]);

        $response->assertJsonFragment([
            'title' => $post->title,
            'slug' => $post->slug,
            'tag_id' => $tag->id,
        ]);

        $response->assertJsonCount(1, 'data');
    }

    public function test_api_returns_product()
    {
        User::factory()->create();
        $post = Post::factory()->create();

        $response = $this->get('api/posts/' . $post->id);
        $response->assertStatus(200);
    }
}
