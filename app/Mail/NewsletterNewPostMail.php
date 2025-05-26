<?php

namespace App\Mail;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterNewPostMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subscriber;

    public $post;

    /**
     * Create a new message instance.
     */
    public function __construct(NewsletterSubscriber $subscriber, $post)
    {
        $this->subscriber = $subscriber;
        $this->post = $post;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        if ($this->subscriber->locale) {
            app()->setLocale($this->subscriber->locale);
        }

        return new Envelope(
            subject: __('New post on the blog!'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        if ($this->subscriber->locale) {
            app()->setLocale($this->subscriber->locale);
        }

        return new Content(
            view: 'emails.newsletter-new-post',
            with: [
                'subscriber' => $this->subscriber,
                'post' => $this->post,
                'postUrl' => route('blog.show', ['locale' => $this->subscriber->locale, 'slug' => $this->post->slug]),
            ]
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
