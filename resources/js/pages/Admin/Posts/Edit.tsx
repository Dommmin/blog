import React from 'react';
import ComboBox from '@/components/ComboBox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import { type Category, type Tag } from '@/types/blog';
import { Head, Link, useForm } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

interface Post {
    id: number;
    title: string;
    content: string;
    published_at: string;
    slug: string;
    category_id: string;
    tags: Tag[];
}

interface EditProps {
    post: Post;
    categories: Category[];
    tags: Tag[];
}

type FormData = {
    title: string;
    content: string;
    published_at: string;
    category_id: string;
    tags: number[];
    _method: string;
};

export default function Edit({ post, categories, tags }: EditProps) {
    const { appearance } = useAppearance();
    const {
        data,
        setData,
        post: submitForm,
        processing,
        errors,
    } = useForm<FormData>({
        title: post.title,
        content: post.content,
        published_at: post.published_at || '',
        category_id: post.category_id,
        tags: post.tags.map((tag) => tag.id),
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitForm(route('admin.posts.update', post.slug));
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
                                    <Button variant="outline" size="sm" className="cursor-pointer">
                                        ← Back to all posts
                                    </Button>
                                </Link>
                            </div>
                            <CardTitle>Edit Post</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="category_id">Category</Label>
                                    <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="content">Content</Label>
                                    <div data-color-mode={appearance} className="dark:data-[color-mode=light]:bg-card">
                                        <MDEditor value={data.content} onChange={(value) => setData('content', value || '')} height={400} />
                                    </div>
                                    {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label>Tags</Label>
                                    <ComboBox
                                        data={tags}
                                        selectedValues={data.tags}
                                        onChange={(value) => setData('tags', value)}
                                        placeholder="Select tags..."
                                    />
                                    {errors.tags && <p className="text-sm text-red-500">{errors.tags}</p>}
                                </div>
                                <Label>Publish at</Label>
                                <div className="flex items-center space-x-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-[240px] justify-start text-left font-normal',
                                                    !data.published_at && 'text-muted-foreground',
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {data.published_at ? format(new Date(data.published_at), 'PPP') : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={new Date(data.published_at)}
                                                onSelect={(date) => date && setData('published_at', date.toISOString())}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <Button type="submit" disabled={processing} className="w-full">
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
