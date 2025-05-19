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
import { type Category, type DataItem } from '@/types/blog';
import { Head, Link, useForm } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';

type FormData = {
    title: string;
    content: string;
    published_at: Date | null;
    category_id: string;
    tags: string[];
};

export default function Create({ categories, tags }: { categories: Category[]; tags: DataItem[] }) {
    const { appearance } = useAppearance();
    const { __, locale } = useTranslations();

    const { data, setData, post, processing, errors } = useForm<FormData>({
        category_id: '',
        title: '',
        content: '',
        published_at: new Date(),
        tags: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.posts.store'));
    };

    return (
        <AdminLayout>
            <Head title={__('Create Post')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="mb-4">
                                <Link href={route('admin.posts.index')} prefetch>
                                    <Button variant="outline" size="sm">
                                        ← {__('Back to all posts')}
                                    </Button>
                                </Link>
                            </div>
                            <CardTitle>{__('Create Post')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="category_id">{__('Category')}</Label>
                                    <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={__('Select a category')} />
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
                                    <Label htmlFor="title">{__('Title')}</Label>
                                    <Input id="title" type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="content">{__('Content')}</Label>
                                    <div data-color-mode={appearance} className="dark:data-[color-mode=light]:bg-card">
                                        <MDEditor value={data.content} onChange={(value) => setData('content', value || '')} height={400} />
                                    </div>
                                    {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label>{__('Tags')}</Label>
                                    <ComboBox
                                        data={tags}
                                        selectedValues={data.tags}
                                        onChange={(value: string[]) => setData('tags', value)}
                                        placeholder="Select tags..."
                                    />
                                    {errors.tags && <p className="text-sm text-red-500">{errors.tags}</p>}
                                </div>
                                <Label>{__('Publish at')}</Label>
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
                                                <CalendarIcon />
                                                {data.published_at ? format(data.published_at, 'PPP') : <span>{__('Pick a date')}</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <Calendar
                                                mode="single"
                                                selected={data.published_at || undefined}
                                                onSelect={(date) => setData('published_at', date || null)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <Button type="submit" disabled={processing} className="w-full">
                                    {__('Save Post')}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
