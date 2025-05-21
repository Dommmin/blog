<?php

namespace App\Mail;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewPostNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $post;

    public $locale;

    public function __construct(Post $post, $locale = null)
    {
        $this->post = $post;
        $this->locale = $locale;
    }

    public function build()
    {
        if ($this->locale) {
            app()->setLocale($this->locale);
        }

        return $this->view('emails.new-post-notification')
            ->subject(__('A new article has been published: ":title"', ['title' => $this->post->title]));
    }
}
