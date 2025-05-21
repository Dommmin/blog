<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewsletterSubscribeRequest;
use App\Mail\NewsletterConfirmationMail;
use App\Mail\NewsletterConfirmedMail;
use App\Mail\UnsubscribedMail;
use App\Models\NewsletterSubscriber;
use Illuminate\Support\Facades\Mail;

class NewsletterController extends Controller
{
    public function subscribe(NewsletterSubscribeRequest $request, string $locale)
    {
        $subscriber = NewsletterSubscriber::create([
            'email' => $request->get('email'),
            'token' => NewsletterSubscriber::generateToken(),
        ]);

        Mail::to($subscriber->email)->queue(new NewsletterConfirmationMail($subscriber, $locale));

        return back()->with('success', 'Check your email to confirm your subscription.');
    }

    public function confirm(string $locale, string $token)
    {
        $subscriber = NewsletterSubscriber::where('token', $token)->firstOrFail();
        if ($subscriber->isConfirmed()) {
            return redirect('/')->with('success', 'You are already subscribed!');
        }
        $subscriber->update([
            'confirmed_at' => now(),
            'token' => null,
        ]);

        Mail::to($subscriber->email)->send(new NewsletterConfirmedMail($subscriber, $locale));

        return to_route('home')->with('success', 'Subscription confirmed!');
    }

    public function unsubscribe(string $locale, string $email)
    {
        $subscriber = NewsletterSubscriber::where('email', $email)->firstOrFail();

        if (!$subscriber->isConfirmed()) {
            return to_route('home')->with('error', 'This subscription is not confirmed.');
        }

        $subscriber->delete();

        Mail::to($subscriber->email)->send(new UnsubscribedMail($subscriber, $locale));

        return to_route('home')->with('success', __('You have successfully unsubscribed from our newsletter.'));
    }
}
