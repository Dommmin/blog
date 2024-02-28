<?php

namespace App\Observers;

use App\Mail\MarkedAsSpam;
use App\Models\Spam;
use App\Models\User;

class SpamObserver
{
    /**
     * Handle the Spam "created" event.
     */
    public function created(Spam $spam): void
    {
        $spamCount = Spam::query()
            ->where('spamable_type', $spam->spamable_type)
            ->where('spamable_id', $spam->spamable_id)
            ->count();

        if ($spamCount >= 5) {
            $users = User::where('is_admin', true)->get();

            foreach ($users as $user) {
                \Mail::to($user)->send(new MarkedAsSpam($spam->spamable_type, $spam->spamable_id));
            }
        }
    }
}
