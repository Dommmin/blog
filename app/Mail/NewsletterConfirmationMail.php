<?php

namespace App\Mail;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class NewsletterConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subscriber;

    public $locale;

    /**
     * Create a new message instance.
     */
    public function __construct(NewsletterSubscriber $subscriber, $locale = null)
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
            subject: __('Newsletter Confirmation Mail'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        if ($this->locale) {
            app()->setLocale($this->locale);
        }

        return new Content(
            view: 'emails.newsletter-confirmation',
            with: [
                'confirmUrl' => URL::temporarySignedRoute(
                    'newsletter.confirm',
                    now()->addDay(),
                    ['locale' => $this->locale, 'token' => $this->subscriber->token]
                ),
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
