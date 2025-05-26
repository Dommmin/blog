<?php

namespace App\Mail;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterConfirmedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subscriber;

    public $locale;

    public $unsubscribeUrl;

    public function __construct(NewsletterSubscriber $subscriber, string $locale, string $unsubscribeUrl)
    {
        $this->subscriber = $subscriber;
        $this->locale = $locale;
        $this->unsubscribeUrl = $unsubscribeUrl;
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

    public function content(): Content
    {
        if ($this->locale) {
            app()->setLocale($this->locale);
        }

        return new Content(
            view: 'emails.newsletter-confirmed',
            with: [
                'unsubscribeUrl' => $this->unsubscribeUrl,
            ],
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
