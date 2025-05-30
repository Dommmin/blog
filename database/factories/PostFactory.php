<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            //            'category_id' => Category::inRandomOrder()->first()->id,
            'title' => $this->faker->sentence(),
            'content' => $this->faker->realTextBetween(1000, 10000),
            'published_at' => now(),
        ];
    }
}
