<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'slug' => $this->slug,
            'published' => (bool)$this->published,
            'views_count' => $this->views_count,
            'thumbnail' => $this->thumbnail,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'votes_count' => $this->votes_count,
            'username' => $this->user->name,
            'is_voted_by_user' => (bool)$this->isVotedByUser,
            'tags' => TagResource::collection($this->tags),

//            'comments' => $this->when($request->is('api/posts/*'), function () {
//                return CommentResource::collection($this->comments);
//            })
        ];
    }
}
