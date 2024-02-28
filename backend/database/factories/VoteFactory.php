<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class VoteFactory extends Factory
{
    protected $model = Vote::class;

    public function definition(): array
    {
        $type = $this->faker->randomElement(['up', 'down']);

        return [
            'type' => $type,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'post_id' => Post::inRandomOrder()->pluck('id')->first(),
            'user_id' => User::inRandomOrder()->pluck('id')->first(),
        ];
    }
}
