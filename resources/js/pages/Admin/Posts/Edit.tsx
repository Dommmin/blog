import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import { Head, useForm } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';

interface Post {
    id: number;
    title: string;
    content: string;
    published_at: string;
    slug: string;
}

interface EditProps {
    post: Post;
}

interface EditPostForm {
    title: string;
    content: string;
    published_at: string;
    _method: string;
    [key: string]: string | undefined;
}

export default function Edit({ post }: EditProps) {
    const {
        data,
        setData,
        post: submitForm,
        processing,
        errors,
    } = useForm({
        title: post.title || '',
        content: post.content || '',
        published_at: post.published_at || '',
        _method: 'PUT',
    });

    // const [preview, setPreview] = useState<string | null>(post.image ? `/storage/${post.image}` : null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitForm(route('admin.posts.update', post.slug));
    };

    // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0] || null;
    //     setData('image', file);
    //
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setPreview(reader.result as string);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    return (
        <AdminLayout>
            <Head title="Edit Post" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Post</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="content">Content</Label>
                                    <div data-color-mode="light" className="dark:data-[color-mode=light]:bg-card">
                                        <MDEditor value={data.content} onChange={(value) => setData('content', value || '')} height={400} />
                                    </div>
                                    {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                                </div>

                                {/*<div className="grid gap-2">*/}
                                {/*    <Label htmlFor="image">Featured Image</Label>*/}
                                {/*    <Input*/}
                                {/*        id="image"*/}
                                {/*        type="file"*/}
                                {/*        onChange={handleImageChange}*/}
                                {/*        accept="image/*"*/}
                                {/*    />*/}
                                {/*    {errors.image && (*/}
                                {/*        <p className="text-sm text-red-500">{errors.image}</p>*/}
                                {/*    )}*/}

                                {/*    {preview && (*/}
                                {/*        <div className="mt-2">*/}
                                {/*            <img*/}
                                {/*                src={preview}*/}
                                {/*                alt="Preview"*/}
                                {/*                className="max-w-xs h-auto rounded"*/}
                                {/*            />*/}
                                {/*        </div>*/}
                                {/*    )}*/}
                                {/*</div>*/}

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
                                                initialFocus
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
