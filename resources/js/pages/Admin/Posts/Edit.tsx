import { ComboBox } from '@/components/ComboBox';
import { FileManager } from '@/components/FileManager';
import InputError from '@/components/input-error';
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
import { type Category, type DataItem, type File as FileType, type Post } from '@/types/blog';
import { Head, Link, useForm } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';

interface EditProps {
    post: Post;
    categories: Category[];
    tags: DataItem[];
    files: {
        data: FileType[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
}

type FormData = {
    title: string;
    content: string;
    published_at: Date | null;
    // category_id: string;
    tags: number[];
    language: string;
    translation_key: string | null;
    file_id: number | null;
    _method: string;
};

export default function Edit({ post, categories, tags, files }: EditProps) {
    const { appearance } = useAppearance();
    const { __ } = useTranslations();

    const {
        data,
        setData,
        post: submitForm,
        errors,
        processing,
    } = useForm<FormData>({
        title: post.title,
        content: post.content,
        published_at: post.published_at ? new Date(post.published_at) : null,
        tags: post.tag_ids ?? [],
        language: post.language,
        translation_key: post.translation_key,
        file_id: post.file_id ?? null,
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
                                    <Button variant="outline" size="sm">
                                        ← {__('Back to all posts')}
                                    </Button>
                                </Link>
                            </div>
                            <CardTitle>Edit Post</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-2">
                                    <Label>{__('Featured Image')}</Label>
                                    <FileManager onSelect={(fileId) => setData('file_id', fileId)} selectedFileId={data.file_id} files={files} />
                                    <InputError message={errors.file_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="language">{__('Language')}</Label>
                                    <Select value={data.language} onValueChange={(value: string) => setData('language', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={__('Select a language')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">{__('English')}</SelectItem>
                                            <SelectItem value="pl">{__('Polish')}</SelectItem>
                                            <SelectItem value="de">{__('German')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.language} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="translation_key">{__('Translation Key')}</Label>
                                    <Input
                                        id="translation_key"
                                        type="text"
                                        value={data.translation_key || ''}
                                        onChange={(e) => setData('translation_key', e.target.value)}
                                        placeholder={__('Enter a unique key to link translations')}
                                    />
                                    <InputError message={errors.translation_key} />
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
                                    <Label htmlFor="title">{__('Title')}</Label>
                                    <Input id="title" type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="content">{__('Content')}</Label>
                                    <div data-color-mode={appearance} className="dark:data-[color-mode=light]:bg-card">
                                        <MDEditor value={data.content} onChange={(value) => setData('content', value || '')} height={400} />
                                    </div>
                                    <InputError message={errors.content} />
                                </div>

                                <div className="grid gap-2">
                                    <Label>{__('Tags')}</Label>
                                    <ComboBox
                                        data={tags}
                                        selectedValues={data.tags.map(String)}
                                        onChange={(value: string[]) => setData('tags', value.map(Number))}
                                        placeholder={__('Select tags...')}
                                    />
                                    <InputError message={errors.tags} />
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
                                                <CalendarIcon className="mr-2 h-4 w-4" />
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
                                    {__('Update Post')}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
