<?php

namespace App\Mail;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterConfirmedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subscriber;

    public $locale;

    public function __construct(NewsletterSubscriber $subscriber, string $locale = 'en')
    {
        $this->subscriber = $subscriber;
        $this->locale = $locale;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        if ($this->locale) {
            app()->setLocale($this->locale);
        }

        return new Envelope(
            subject: __('Newsletter Confirmed'),
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
