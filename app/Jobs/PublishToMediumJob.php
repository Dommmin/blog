<?php

namespace App\Jobs;

use App\Models\Post;
use App\Services\MediumService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class PublishToMediumJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $post;

    /**
     * Create a new job instance.
     */
    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    /**
     * Execute the job.
     */
    public function handle(MediumService $medium)
    {
        $medium->publishPost(
            $this->post->title,
            $this->post->content, // zakładam, że content to HTML
            $this->post->tags->pluck('name')->toArray(),
            url('/blog/'.$this->post->slug)
        );
    }
}
