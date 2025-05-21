<?php

namespace App\Jobs;

use App\Mail\NewPostNotificationMail;
use App\Models\NewsletterSubscriber;
use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendNewPostToSubscribers implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $post;

    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    public function handle()
    {
        $subscribers = NewsletterSubscriber::whereNotNull('confirmed_at')->get();

        foreach ($subscribers as $subscriber) {
            Mail::to($subscriber->email)->queue(new NewPostNotificationMail($this->post, $subscriber->locale));
        }
    }
}
