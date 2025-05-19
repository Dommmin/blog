import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Post } from '@/types/blog';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface BlogIndexProps {
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
}

export default function Index({ posts }: BlogIndexProps) {
    const { __ } = useTranslations();
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('');
    const [suggestions, setSuggestions] = useState<{ id: number; title: string }[]>([]);
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search.length >= 2) {
                fetch(`/api/suggest-posts?query=${encodeURIComponent(search)}`)
                    .then((res) => res.json())
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

    return (
        <AppLayout>
            <Head title="Blog" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <div className="relative w-full" ref={inputRef}>
                            <Input
                                className="w-full"
                                placeholder={__('Search posts...')}
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setHighlightedIndex(-1);
                                }}
                                onFocus={() => setSuggestionsOpen(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        setHighlightedIndex((prev) =>
                                            Math.min(prev + 1, suggestions.length - 1)
                                        );
                                    } else if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                                    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
                                        e.preventDefault();
                                        const selected = suggestions[highlightedIndex];
                                        if (selected) {
                                            setSearch(selected.title);
                                            setSuggestionsOpen(false);
                                            setHighlightedIndex(-1);
                                        }
                                    } else if (e.key === 'Escape') {
                                        setSuggestionsOpen(false);
                                    }
                                }}
                            />
                            {suggestionsOpen && suggestions.length > 0 && (
                                <ul className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-md dark:bg-zinc-900">
                                    {suggestions.map((s, i) => (
                                        <li
                                            key={s.id}
                                            className={`cursor-pointer px-4 py-2 ${
                                                i === highlightedIndex
                                                    ? 'bg-muted font-medium'
                                                    : 'hover:bg-muted'
                                            }`}
                                            onMouseDown={() => {
                                                setSearch(s.title);
                                                setSuggestionsOpen(false);
                                                setHighlightedIndex(-1);
                                            }}
                                        >
                                            {s.title}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="w-48">
                            <Select value={sort} onValueChange={setSort}>
                                <SelectTrigger>
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
                            <h1 className="text-muted-foreground text-3xl tracking-widest">
                                {__('No posts found')}
                            </h1>
                        </div>
                    )}

                    {(posts.prev_page_url || posts.next_page_url) && (
                        <div className="mt-12">
                            <Pagination className="justify-between">
                                {posts.prev_page_url ? (
                                    <Link preserveScroll href={posts.prev_page_url} prefetch>
                                        <Button variant="outline">{__('Previous')}</Button>
                                    </Link>
                                ) : (
                                    <Button variant="outline" disabled>
                                        {__('Previous')}
                                    </Button>
                                )}

                                <div>
                                    {__('Page')} {posts.current_page} {__('of')} {posts.last_page}
                                </div>

                                {posts.next_page_url ? (
                                    <Link preserveScroll href={posts.next_page_url} prefetch>
                                        <Button variant="outline">{__('Next')}</Button>
                                    </Link>
                                ) : (
                                    <Button variant="outline" disabled>
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
