<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Post;
use App\Models\PostView;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class PostViewFactory extends Factory
{
    protected $model = PostView::class;

    public function definition(): array
    {
        return [
            'ip_address' => $this->faker->ipv4(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'post_id' => Post::inRandomOrder()->pluck('id')->first(),
        ];
    }
}
