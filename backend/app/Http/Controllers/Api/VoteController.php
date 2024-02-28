<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVoteRequest;
use App\Models\Vote;

class VoteController extends Controller
{
    public function store(StoreVoteRequest $request)
    {
        return Vote::create($request->validated() + ['user_id' => auth()->id()]);
    }

    public function destroy(Vote $vote)
    {
        $this->authorize('delete', $vote);

        $vote->delete();

        return response()->noContent();
    }
}
