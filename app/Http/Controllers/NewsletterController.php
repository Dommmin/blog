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
        $subscriber = NewsletterSubscriber::where('email', $request->get('email'))->first();

        if ($subscriber) {
            if ($subscriber->isConfirmed() && !$subscriber->unsubscribed_at) {
                return back()->with('error', __('You are already subscribed to our newsletter.'));
            }

            $subscriber->update([
                'token' => NewsletterSubscriber::generateToken(),
                'locale' => $locale,
                'unsubscribed_at' => null,
            ]);
        } else {
            $subscriber = NewsletterSubscriber::create([
                'email' => $request->get('email'),
                'token' => NewsletterSubscriber::generateToken(),
                'locale' => $locale,
            ]);
        }

        Mail::to($subscriber->email)->queue(new NewsletterConfirmationMail($subscriber, $locale));

        return back()->with('success', __('Check your email to confirm your subscription.'));
    }

    public function confirm(string $locale, string $token)
    {
        $subscriber = NewsletterSubscriber::where('token', $token)->first();

        if (! $subscriber) {
            return redirect('/')->with('error', __('Invalid token!'));
        }

        if ($subscriber->isConfirmed()) {
            return redirect('/')->with('success', __('You are already subscribed!'));
        }

        $subscriber->update([
            'confirmed_at' => now(),
            'token' => null,
        ]);

        $unsubscribeUrl = url('/' . $locale . '/newsletter/unsubscribe/' . $subscriber->email);
        Mail::to($subscriber->email)->queue(new NewsletterConfirmedMail($subscriber, $locale, $unsubscribeUrl));

        return view('newsletter.confirmed');
    }

    public function unsubscribe(string $locale, string $email)
    {
        $subscriber = NewsletterSubscriber::where('email', $email)->firstOrFail();

        if (! $subscriber->isConfirmed()) {
            return to_route('home')->with('error', 'This subscription is not confirmed.');
        }

        $subscriber->update([
            'confirmed_at' => null,
            'token' => null,
            'unsubscribed_at' => now(),
        ]);

        Mail::to($subscriber->email)->queue(new UnsubscribedMail($subscriber, $locale));

        return to_route('home')->with('success', __('You have successfully unsubscribed from our newsletter.'));
    }
}
