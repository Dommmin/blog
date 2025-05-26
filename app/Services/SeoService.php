<?php

namespace App\Services;

use App\Models\Post;

class SeoService
{
    public function getSeoData(array $data = []): array
    {
        $defaultData = [
            'title' => config('app.name'),
            'description' => '',
            'type' => 'website',
            'url' => url()->current(),
            'canonical' => url()->current(),
            'robots' => 'index, follow',
            'structuredData' => $this->getDefaultStructuredData(),
        ];

        return array_merge($defaultData, $data);
    }

    /**
     * @param  Post  $post  // $post->author is \App\Models\User, $post->category is \App\Models\Category
     */
    public function getPostSeoData(Post $post): array
    {
        /** @var \App\Models\User $author */
        $author = $post->author;
        /** @var \App\Models\Category $category */
        $category = $post->category;

        $structuredData = [
            '@context' => 'https://schema.org',
            '@type' => 'BlogPosting',
            'headline' => $post->title,
            'datePublished' => $post->published_at->toIso8601String(),
            'dateModified' => $post->updated_at->toIso8601String(),
            'author' => [
                '@type' => 'Person',
                'name' => $author->name,
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

        $articleData = [
            'published_time' => $post->published_at->toIso8601String(),
            'modified_time' => $post->updated_at->toIso8601String(),
            'author' => $author->name,
            'section' => $category->name,
            'tags' => $post->tags->pluck('name')->toArray(),
        ];

        return $this->getSeoData([
            'title' => $post->title,
            'description' => $post->excerpt,
            'type' => 'article',
            'url' => route('blog.show', ['post' => $post->slug, 'locale' => $post->language]),
            'canonical' => route('blog.show', ['post' => $post->slug, 'locale' => $post->language]),
            'article' => $articleData,
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

    private function getDefaultStructuredData(): array
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
