<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PostTest extends TestCase
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

    public function test_api_returns_post(): void
    {
        User::factory()->create();
        $post = Post::factory()->create();

        $response = $this->get('api/posts/' . $post->id);
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'title' => $post->title,
        ]);
    }

    public function test_api_store_post(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        Tag::factory(2)->create();

        $image = UploadedFile::fake()->image('1.jpg');

        $this->actingAs($user);

        $product = [
            'title' => 'test',
            'body' => 'test',
            'slug' => 'test',
            'tags' => Tag::pluck('id')->toArray(),
            'thumbnail' => $image,
            'published' => true,
        ];

        $this->post('api/posts', $product);

        $post = Post::first();

        $response = $this->get('api/posts/' . $post->id);
        $response->assertStatus(200);

        $response->assertJsonFragment([
            'title' => $product['title'],
        ]);
    }

    public function test_api_delete_post_successful(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        $this->actingAs($user);
        $response = $this->delete('api/posts/' . $post->id);

        $response->assertStatus(204);

        $this->assertDatabaseMissing('posts', $post->toArray());
    }

    public function test_api_delete_post_unsuccessful(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $post = Post::factory()->create([
            'user_id' => $user2->id,
        ]);

        $this->actingAs($user1);
        $response = $this->delete('api/posts/' . $post->id);

        $response->assertStatus(403);

        $this->assertDatabaseHas('posts', ['id' => $post->id]);
    }
}
