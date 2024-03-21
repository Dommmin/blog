<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Post;
use App\Models\PostView;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessViewCount implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(protected Post $post, protected ?int $userId, protected $ipAddress)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        PostView::firstOrCreate([
            'post_id' => $this->post->id,
            'user_id' => $this->userId,
            'ip_address' => $this->ipAddress,
        ]);
    }
}
