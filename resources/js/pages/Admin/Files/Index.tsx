import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { useTranslations } from '@/hooks/useTranslation';
import AdminLayout from '@/layouts/admin-layout';
import { type File as FileType } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { BookIcon, FileIcon, Loader2, PlusIcon, XIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface FilePageProps {
    files: {
        data: FileType[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
}

export default function Index({ files }: FilePageProps) {
    const { __, locale } = useTranslations();

    const { data, setData, reset, post, processing } = useForm<{ file: File | null }>({
        file: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file as never);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('admin.files.store'), {
            onSuccess: () => {
                setData('file', null as never);
                reset();
                toast.success(__('File uploaded successfully'));
            },
        });
    };

    const handleDelete = (id: number | string) => {
        router.delete(route('admin.files.destroy', { file: id }), {
            onSuccess: () => {
                toast.success(__('File deleted successfully'));
            },
        });
    };

    const renderFileIcon = (file: FileType) => {
        const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/ico'];

        switch (file.mime_type) {
            case 'application/pdf':
                return (
                    <div className="flex items-center">
                        <BookIcon className="mr-2 h-12 w-12 text-red-500" />
                        <span className="text-muted-foreground text-sm">{file.original_name}</span>
                    </div>
                );
            default:
                if (imageMimeTypes.includes(file.mime_type)) {
                    return (
                        <div className="flex items-center">
                            <img src={file.url} alt={file.name} className="mr-2 h-20 w-20 rounded-md object-cover" />
                        </div>
                    );
                }
                return (
                    <div className="flex items-center">
                        <FileIcon className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-muted-foreground text-sm">{file.original_name}</span>
                    </div>
                );
        }
    };

    return (
        <AdminLayout>
            <Head title={__('Manage Files')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-background dark:border-border overflow-hidden rounded-lg shadow-sm dark:border">
                        <div className="dark:border-border border-b p-6">
                            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                                <Input id="file" type="file" name="file" onChange={handleFileChange} />

                                <Button disabled={!data.file || processing} type="submit">
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : __('Upload')}
                                </Button>
                            </form>

                            <div className="mt-6 flex flex-wrap gap-6">
                                {files.data.map((file) => (
                                    <div key={file.id} className="flex items-center">
                                        <div className="group relative">
                                            {renderFileIcon(file)}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        onClick={(e) => e.stopPropagation()}
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute -top-1 -right-1 hidden h-4 w-4 items-center justify-center rounded-full p-0 text-xs opacity-0 transition-opacity duration-300 group-hover:block group-hover:opacity-100"
                                                    >
                                                        <XIcon className="h-2 w-2" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>{__('Are you sure?')}</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            {__('This action cannot be undone. This will permanently delete this file.')}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>{__('Cancel')}</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(file.id)}>{__('Delete')}</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {(files.prev_page_url || files.next_page_url) && (
                                <div className="mt-6">
                                    <Pagination className="justify-between">
                                        {files.prev_page_url ? (
                                            <Button variant="outline" asChild>
                                                <Link href={files.prev_page_url} prefetch>
                                                    {__('Previous')}
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button variant="outline" disabled>
                                                {__('Previous')}
                                            </Button>
                                        )}

                                        <div className="text-muted-foreground text-sm">
                                            {__('Page')} {files.current_page} {__('of')} {files.last_page}
                                        </div>

                                        {files.next_page_url ? (
                                            <Button variant="outline" asChild>
                                                <Link href={files.next_page_url} prefetch>
                                                    {__('Next')}
                                                </Link>
                                            </Button>
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
                </div>
            </div>
        </AdminLayout>
    );
}
