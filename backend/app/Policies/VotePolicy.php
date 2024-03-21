<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use App\Models\Vote;
use Illuminate\Auth\Access\HandlesAuthorization;

class VotePolicy
{
    use HandlesAuthorization;

    public function delete(User $user, Vote $vote): bool
    {
        return $user->id === $vote->user_id;
    }
}
