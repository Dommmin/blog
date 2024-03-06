<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class PostFactory extends Factory
{
    use WithoutModelEvents;

    protected $model = Post::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'slug' => $this->faker->slug(),
            'body' => $this->faker->paragraphs(30, true),
            'published' => $this->faker->boolean(),
            'thumbnail' => $this->faker->imageUrl(640, 480, 'animals', true),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'user_id' => User::inRandomOrder()->pluck('id')->first(),
        ];
    }
}
