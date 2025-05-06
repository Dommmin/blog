<?php

namespace App\Jobs;

use App\Mail\NewsletterConfirmationMail;
use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable as Dispatchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendNewsletterConfirmationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $subscriber;

    /**
     * Create a new job instance.
     */
    public function __construct(NewsletterSubscriber $subscriber)
    {
        $this->subscriber = $subscriber;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->subscriber->email)
            ->send(new NewsletterConfirmationMail($this->subscriber));
    }
}
