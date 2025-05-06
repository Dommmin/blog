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
        return new Envelope(
            subject: 'Newsletter New Post Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
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

    public function build()
    {
        return $this->subject('New post on the blog!')
            ->view('emails.newsletter-new-post')
            ->with([
                'subscriber' => $this->subscriber,
                'post' => $this->post,
            ]);
    }
}
