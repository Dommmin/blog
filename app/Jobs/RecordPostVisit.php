<?php

namespace App\Jobs;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RecordPostVisit implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private readonly int $postId,
        private readonly ?int $userId,
        private readonly string $ipAddress
    ) {}

    public function handle(): void
    {
        $post = Post::find($this->postId);

        if (! $post) {
            return;
        }

        $exists = $post->visits()
            ->where(function ($query) {
                $query->where('ip_address', $this->ipAddress)
                    ->when($this->userId, function ($query) {
                        $query->orWhere('user_id', $this->userId);
                    });
            })
            ->exists();

        if (! $exists) {
            $post->visits()->create([
                'user_id' => $this->userId,
                'ip_address' => $this->ipAddress,
            ]);
        }
    }
}
