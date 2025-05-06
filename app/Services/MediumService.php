<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MediumService
{
    protected $token;

    protected $baseUrl = 'https://api.medium.com/v1';

    public function __construct()
    {
        $this->token = config('services.medium.token');
    }

    public function getUserId()
    {
        $response = Http::withToken($this->token)
            ->get($this->baseUrl.'/me');

        return $response->json('data.id');
    }

    public function publishPost($title, $content, $tags = [], $canonicalUrl = null)
    {
        $userId = $this->getUserId();

        $data = [
            'title' => $title,
            'contentFormat' => 'html',
            'content' => $content,
            'tags' => $tags,
            'publishStatus' => 'public',
        ];

        if ($canonicalUrl) {
            $data['canonicalUrl'] = $canonicalUrl;
        }

        $response = Http::withToken($this->token)
            ->post("{$this->baseUrl}/users/{$userId}/posts", $data);

        return $response->json();
    }
}
