import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Post } from '@/types/blog';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimateStagger } from '@/components/AnimateOnView';

interface BlogIndexProps {
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    filters: {
        search: string;
        sort: string;
        page: number;
    };
}

export default function Index({ posts, filters }: BlogIndexProps) {
    const { __, locale } = useTranslations();
    const [search, setSearch] = useState(filters.search);
    const [sort, setSort] = useState(filters.sort);
    const [suggestions, setSuggestions] = useState<{ id: number; title: string }[]>([]);
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        setHighlightedIndex(-1);
    }, []);

    const handleSort = useCallback((value: string) => {
        setSort(value);
    }, []);

    const handleSuggestionSelect = useCallback((suggestion: { id: number; title: string }) => {
        setSearch(suggestion.title);
        setSuggestionsOpen(false);
        setHighlightedIndex(-1);
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter' && highlightedIndex >= 0) {
                e.preventDefault();
                const selected = suggestions[highlightedIndex];
                if (selected) {
                    handleSuggestionSelect(selected);
                }
            } else if (e.key === 'Escape') {
                setSuggestionsOpen(false);
            }
        },
        [suggestions, highlightedIndex, handleSuggestionSelect],
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search.length >= 2) {
                axios
                    .get(route('blog.suggest-posts', { query: search }))
                    .then((res) => res.data)
                    .then(setSuggestions);
            } else {
                setSuggestions([]);
            }

            router.reload({
                only: ['posts'],
                data: { search, sort },
            });
        }, 400);
        return () => clearTimeout(timeout);
    }, [sort, search]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!inputRef.current?.contains(e.target as Node)) {
                setSuggestionsOpen(false);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const metaDescription = useMemo(() => __('Browse our collection of blog posts about technology, programming, and software development.'), [__]);
    const metaTitle = useMemo(() => __('Blog - Technology and Programming Articles'), [__]);

    return (
        <AppLayout>
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <link rel="canonical" href={window.location.origin + route('blog.index')} />
                <meta name="robots" content="index, follow" />
            </Head>

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <div className="relative w-full" ref={inputRef}>
                            <Input
                                className="w-full"
                                placeholder={__('Search posts...')}
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                onFocus={() => setSuggestionsOpen(true)}
                                onKeyDown={handleKeyDown}
                                aria-label={__('Search posts')}
                                aria-expanded={suggestionsOpen}
                                aria-controls="search-suggestions"
                                role="combobox"
                            />
                            {suggestionsOpen && suggestions.length > 0 && (
                                <ul
                                    id="search-suggestions"
                                    className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-md dark:bg-zinc-900"
                                    role="listbox"
                                >
                                    {suggestions.map((s, i) => (
                                        <li
                                            key={s.id}
                                            role="option"
                                            aria-selected={i === highlightedIndex}
                                            className={`cursor-pointer px-4 py-2 ${
                                                i === highlightedIndex ? 'bg-muted font-medium' : 'hover:bg-muted'
                                            }`}
                                            onMouseDown={() => handleSuggestionSelect(s)}
                                        >
                                            {s.title}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="w-48">
                            <Select value={sort} onValueChange={handleSort}>
                                <SelectTrigger aria-label={__('Sort posts')}>
                                    <SelectValue placeholder={__('Sort by')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">{__('Latest')}</SelectItem>
                                    <SelectItem value="oldest">{__('Oldest')}</SelectItem>
                                    <SelectItem value="title_asc">{__('Title A-Z')}</SelectItem>
                                    <SelectItem value="title_desc">{__('Title Z-A')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {posts.data.length >= 1 ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {posts.data.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <h1 className="text-muted-foreground text-3xl tracking-widest">{__('No posts found')}</h1>
                        </div>
                    )}

                    {(posts.prev_page_url || posts.next_page_url) && (
                        <div className="mt-12">
                            <Pagination className="justify-between">
                                {posts.prev_page_url ? (
                                    <Link preserveScroll href={posts.prev_page_url} prefetch aria-label={__('Previous page')}>
                                        <Button variant="outline">{__('Previous')}</Button>
                                    </Link>
                                ) : (
                                    <Button variant="outline" disabled aria-label={__('Previous page')}>
                                        {__('Previous')}
                                    </Button>
                                )}

                                <div>
                                    {__('Page')} {posts.current_page} {__('of')} {posts.last_page}
                                </div>

                                {posts.next_page_url ? (
                                    <Link preserveScroll href={posts.next_page_url} prefetch aria-label={__('Next page')}>
                                        <Button variant="outline">{__('Next')}</Button>
                                    </Link>
                                ) : (
                                    <Button variant="outline" disabled aria-label={__('Next page')}>
                                        {__('Next')}
                                    </Button>
                                )}
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
