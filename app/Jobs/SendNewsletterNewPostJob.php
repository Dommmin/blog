<?php

namespace App\Jobs;

use App\Mail\NewsletterNewPostMail;
use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable as Dispatchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendNewsletterNewPostJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $post;

    /**
     * Create a new job instance.
     */
    public function __construct($post)
    {
        $this->post = $post;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $subscribers = NewsletterSubscriber::whereNotNull('confirmed_at')->get();
        foreach ($subscribers as $subscriber) {
            Mail::to($subscriber->email)
                ->send(new NewsletterNewPostMail($subscriber, $this->post));
        }
    }
}
