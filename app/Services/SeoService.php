<?php

namespace App\Services;

use App\Models\Post;

class SeoService
{
    public function getSeoData(array $data = []): array
    {
        return array_merge(self::getDefaultSeoData(), $data);
    }

    public function getPostSeoData(Post $post): array
    {
        $structuredData = [
            '@context' => 'https://schema.org',
            '@type' => 'BlogPosting',
            'headline' => $post->title,
            'datePublished' => $post->published_at?->toIso8601String(),
            'dateModified' => $post->updated_at->toIso8601String(),
            'author' => [
                '@type' => 'Person',
                'name' => $post->author->name,
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => config('app.name'),
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => asset('logo.png'),
                ],
            ],
            'description' => $post->excerpt,
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => route('blog.show', ['post' => $post->slug, 'locale' => $post->language]),
            ],
            'image' => [
                '@type' => 'ImageObject',
                'url' => asset('logo.png'),
            ],
        ];

        return $this->getSeoData([
            'title' => $post->title,
            'description' => $post->excerpt,
            'type' => 'article',
            'url' => route('blog.show', ['post' => $post->slug, 'locale' => $post->language]),
            'canonical' => route('blog.show', ['post' => $post->slug, 'locale' => $post->language]),
            'article' => [
                'published_time' => $post->published_at?->toIso8601String(),
                'modified_time' => $post->updated_at->toIso8601String(),
                'author' => $post->author->name,
                'section' => $post->category->name,
                'tags' => $post->tags->pluck('name')->toArray(),
            ],
            'structuredData' => $structuredData,
        ]);
    }

    public function getBlogIndexSeoData(): array
    {
        $structuredData = [
            '@context' => 'https://schema.org',
            '@type' => 'Blog',
            'name' => config('app.name'),
            'url' => route('blog.index'),
            'description' => __('Browse our collection of blog posts about technology, programming, and software development.'),
            'publisher' => [
                '@type' => 'Organization',
                'name' => config('app.name'),
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => asset('logo.png'),
                ],
            ],
        ];

        return $this->getSeoData([
            'title' => __('Blog - Technology and Programming Articles'),
            'description' => __('Browse our collection of blog posts about technology, programming, and software development.'),
            'url' => route('blog.index'),
            'canonical' => route('blog.index'),
            'structuredData' => $structuredData,
        ]);
    }

    public function getAboutSeoData(): array
    {
        $structuredData = [
            '@context' => 'https://schema.org',
            '@type' => 'AboutPage',
            'name' => config('app.name'),
            'url' => route('about'),
            'description' => __('Learn more about Dominik Jasiński - PHP Developer & DevOps Engineer with expertise in Laravel, Symfony, React, and modern development practices.'),
            'publisher' => [
                '@type' => 'Organization',
                'name' => config('app.name'),
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => asset('logo.png'),
                ],
            ],
        ];

        return $this->getSeoData([
            'title' => __('About me'),
            'description' => __('Learn more about Dominik Jasiński - PHP Developer & DevOps Engineer with expertise in Laravel, Symfony, React, and modern development practices.'),
            'url' => route('about'),
            'canonical' => route('about'),
            'structuredData' => $structuredData,
        ]);
    }

    public static function getDefaultSeoData(): array
    {
        return [
            'title' => __('PHP & DevOps Blog'),
            'description' => __('Technical insights, best practices, and deep dives into Laravel, Symfony, and modern DevOps solutions'),
            'type' => 'website',
            'url' => url()->current(),
            'canonical' => url()->current(),
            'robots' => 'index, follow',
            'structuredData' => self::getDefaultStructuredData(),
        ];
    }

    public static function getDefaultStructuredData(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'name' => config('app.name'),
            'url' => url('/'),
            'publisher' => [
                '@type' => 'Organization',
                'name' => config('app.name'),
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => asset('logo.png'),
                ],
            ],
        ];
    }
}
