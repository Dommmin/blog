<?php

namespace App\Mail;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UnsubscribedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subscriber;

    public $locale;

    public function __construct(NewsletterSubscriber $subscriber, $locale = null)
    {
        $this->subscriber = $subscriber;
        $this->locale = $locale;
    }

    public function build()
    {
        if ($this->locale) {
            app()->setLocale($this->locale);
        }

        return $this->view('emails.unsubscribed')
            ->subject(__('You have unsubscribed from the newsletter'));
    }
}
