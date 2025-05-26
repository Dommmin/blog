<?php

namespace App\Mail;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
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

    public function envelope(): Envelope
    {
        if ($this->locale) {
            app()->setLocale($this->locale);
        }

        return new Envelope(
            subject: __('Unsubscribed from newsletter'),
        );
    }

    public function content()
    {
        if ($this->locale) {
            app()->setLocale($this->locale);
        }

        return new Content(
            view: 'emails.unsubscribed',
        );
    }
}
