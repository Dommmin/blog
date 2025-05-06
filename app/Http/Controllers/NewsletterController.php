<?php

namespace App\Http\Controllers;

use App\Jobs\SendNewsletterConfirmationJob;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email:rfc,dns|unique:newsletter_subscribers,email',
        ]);

        $token = NewsletterSubscriber::generateToken();
        $subscriber = NewsletterSubscriber::create([
            'email' => $data['email'],
            'token' => $token,
        ]);

        // Wyślij maila z linkiem potwierdzającym
        dispatch(new SendNewsletterConfirmationJob($subscriber));

        return back()->with('success', 'Check your email to confirm your subscription.');
    }

    public function confirm($token)
    {
        $subscriber = NewsletterSubscriber::where('token', $token)->firstOrFail();
        if ($subscriber->isConfirmed()) {
            return redirect('/')->with('success', 'You are already subscribed!');
        }
        $subscriber->update([
            'confirmed_at' => now(),
            'token' => null,
        ]);

        return redirect('/')->with('success', 'Subscription confirmed!');
    }
}
