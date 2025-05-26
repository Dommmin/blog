import { ComboBox } from '@/components/ComboBox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppearance } from '@/hooks/use-appearance';
import { useTranslations } from '@/hooks/useTranslation';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import { type Category, type DataItem, type Post } from '@/types/blog';
import { Head, Link, useForm } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';

interface EditProps {
    post: Post;
    categories: Category[];
    tags: DataItem[];
}

type FormData = Record<string, string | string[] | Date | null> & {
    title: string;
    content: string;
    published_at: Date | null;
    // category_id: string;
    tags: string[];
    language: string;
    translation_key: string | null;
    _method: string;
};

export default function Edit({ post, categories, tags }: EditProps) {
    const { appearance } = useAppearance();
    const { __ } = useTranslations();
    const tagOptions = tags;
    const form = useForm<FormData>({
        title: post.title,
        content: post.content,
        published_at: post.published_at ? new Date(post.published_at) : null,
        // category_id: post.category_id.toString(),
        tags: post.tags?.map((tag) => tag.id.toString()) ?? [],
        language: post.language,
        translation_key: post.translation_key,
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('admin.posts.update', post.slug));
    };

    return (
        <AdminLayout>
            <Head title="Edit Post" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="mb-4">
                                <Link href={route('admin.posts.index')} prefetch>
                                    <Button variant="outline" size="sm">
                                        ← Back to all posts
                                    </Button>
                                </Link>
                            </div>
                            <CardTitle>Edit Post</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Select value={form.data.language} onValueChange={(value: string) => form.setData('language', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="pl">Polski</SelectItem>
                                            <SelectItem value="de">Deutsch</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {form.errors.language && <p className="text-sm text-red-500">{form.errors.language}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="translation_key">Translation Key</Label>
                                    <Input
                                        id="translation_key"
                                        type="text"
                                        value={form.data.translation_key || ''}
                                        onChange={(e) => form.setData('translation_key', e.target.value)}
                                        placeholder="Enter a unique key to link translations"
                                    />
                                    {form.errors.translation_key && <p className="text-sm text-red-500">{form.errors.translation_key}</p>}
                                </div>

                                {/*<div className="grid gap-2">*/}
                                {/*    <Label htmlFor="category_id">Category</Label>*/}
                                {/*    <Select value={form.data.category_id} onValueChange={(value: string) => form.setData('category_id', value)}>*/}
                                {/*        <SelectTrigger>*/}
                                {/*            <SelectValue placeholder="Select a category" />*/}
                                {/*        </SelectTrigger>*/}
                                {/*        <SelectContent>*/}
                                {/*            {categories.map((category) => (*/}
                                {/*                <SelectItem key={category.id} value={category.id.toString()}>*/}
                                {/*                    {category.name}*/}
                                {/*                </SelectItem>*/}
                                {/*            ))}*/}
                                {/*        </SelectContent>*/}
                                {/*    </Select>*/}
                                {/*    {form.errors.category_id && <p className="text-sm text-red-500">{form.errors.category_id}</p>}*/}
                                {/*</div>*/}

                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={form.data.title}
                                        onChange={(e) => form.setData('title', e.target.value)}
                                        required
                                    />
                                    {form.errors.title && <p className="text-sm text-red-500">{form.errors.title}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="content">Content</Label>
                                    <div data-color-mode={appearance} className="dark:data-[color-mode=light]:bg-card">
                                        <MDEditor value={form.data.content} onChange={(value) => form.setData('content', value || '')} height={400} />
                                    </div>
                                    {form.errors.content && <p className="text-sm text-red-500">{form.errors.content}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label>Tags</Label>
                                    <ComboBox
                                        data={tagOptions}
                                        selectedValues={form.data.tags}
                                        onChange={(value: string[]) => form.setData('tags', value)}
                                        placeholder={__('Select tags...')}
                                    />
                                    {form.errors.tags && <p className="text-sm text-red-500">{form.errors.tags}</p>}
                                </div>
                                <Label>Publish at</Label>
                                <div className="flex items-center space-x-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-[240px] justify-start text-left font-normal',
                                                    !form.data.published_at && 'text-muted-foreground',
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {form.data.published_at ? format(form.data.published_at, 'PPP') : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <Calendar
                                                mode="single"
                                                selected={form.data.published_at || undefined}
                                                onSelect={(date) => form.setData('published_at', date || null)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <Button type="submit" disabled={form.processing} className="w-full">
                                    Update Post
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
