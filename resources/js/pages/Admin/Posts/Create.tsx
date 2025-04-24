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

interface CreatePostForm {
    title: string;
    content: string;
    published_at: Date | null;
    [key: string]: string | Date | null | undefined;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        published_at: null,
    });

    // const [preview, setPreview] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.posts.store'));
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
    //     } else {
    //         setPreview(null);
    //     }
    // };

    return (
        <AdminLayout>
            <Head title="Create Post" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Post</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="content">Content</Label>
                                    <div data-color-mode="light" className="dark:data-[color-mode=light]:bg-card">
                                        <MDEditor value={data.content} onChange={(value) => setData('content', value || '')} height={400} />
                                    </div>
                                    {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                                </div>

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
                                                {data.published_at ? format(data.published_at, 'PPP') : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={data.published_at || undefined}
                                                // @ts-expect-error - Type issues with Inertia forms
                                                onSelect={(date) => setData('published_at', date)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <Button type="submit" disabled={processing} className="w-full">
                                    Save Post
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
