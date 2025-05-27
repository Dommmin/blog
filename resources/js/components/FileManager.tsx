import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import { type File as FileType } from '@/types/blog';
import { router, useForm } from '@inertiajs/react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Pagination } from './ui/pagination';

interface FileDialogProps {
    onSelect: (file: number) => void;
    selectedFileId?: number | null;
    files: {
        data: FileType[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
}

export function FileManager({ onSelect, selectedFileId, files }: FileDialogProps) {
    const [open, setOpen] = useState(false);
    const { __ } = useTranslations();

    const { data, setData, reset, post, processing } = useForm<{ file: File | null }>({
        file: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file as never);
        }
    };

    const handleFileUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        post(route('admin.files.store'), {
            onSuccess: () => {
                setData('file', null as never);
                reset();
                toast.success(__('File uploaded successfully'));
            },
        });
    };

    const handleFileSelect = (file: FileType) => {
        onSelect(file.id);
        setOpen(false);
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.get(
            url,
            {},
            {
                preserveState: true,
                replace: true,
                onSuccess: () => setOpen(true),
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" type="button">
                    {selectedFileId ? __('Change File') : __('Select File')}
                </Button>
            </DialogTrigger>
            <DialogContent className="flex h-[90vh] w-[95vw] max-w-none flex-col p-0" style={{ width: '95vw', maxWidth: '95vw' }}>
                <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle>{__('File Manager')}</DialogTitle>
                </DialogHeader>
                <div className="flex min-h-0 flex-1 flex-col px-4">
                    <div className="min-h-0 flex-1 overflow-auto">
                        <div className="grid auto-rows-max grid-cols-2 gap-1.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 lg:gap-4">
                            {files.data.map((file) => (
                                <Card
                                    key={file.id}
                                    className={cn(
                                        'hover:bg-accent cursor-pointer transition-colors',
                                        selectedFileId === file.id && 'border-primary border-2',
                                        'aspect-square',
                                    )}
                                    onClick={() => handleFileSelect(file)}
                                >
                                    <CardContent className="h-full w-full p-1">
                                        {file.mime_type.startsWith('image/') ? (
                                            <img
                                                src={file.url || '/placeholder.svg'}
                                                alt={file.original_name}
                                                className="aspect-square h-full w-full rounded-sm object-cover"
                                            />
                                        ) : (
                                            <div className="bg-muted flex aspect-square h-full w-full items-center justify-center rounded-sm">
                                                <span className="text-lg">📄</span>
                                            </div>
                                        )}
                                        <p className="mt-0.5 truncate text-[9px] leading-tight">{file.original_name}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {(files.prev_page_url || files.next_page_url) && (
                    <div className="mt-6 px-4">
                        <Pagination className="justify-between">
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(files.prev_page_url)}
                                onMouseEnter={() =>
                                    files.prev_page_url &&
                                    router.prefetch(
                                        files.prev_page_url,
                                        { method: 'get', data: { page: files.current_page - 1 } },
                                        { cacheFor: '1m' },
                                    )
                                }
                                disabled={!files.prev_page_url}
                            >
                                {__('Previous')}
                            </Button>

                            <div className="text-muted-foreground text-sm">
                                {__('Page')} {files.current_page} {__('of')} {files.last_page}
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(files.next_page_url)}
                                onMouseEnter={() =>
                                    files.next_page_url &&
                                    router.prefetch(
                                        files.next_page_url,
                                        { method: 'get', data: { page: files.current_page + 1 } },
                                        { cacheFor: '1m' },
                                    )
                                }
                                disabled={!files.next_page_url}
                            >
                                {__('Next')}
                            </Button>
                        </Pagination>
                    </div>
                )}

                <DialogFooter className="border-t px-6 py-2">
                    <form onSubmit={handleFileUpload} className="flex items-center">
                        <Input type="file" onChange={handleFileChange} />
                        <Button type="submit" disabled={!data.file || processing} size="sm" className="h-7 px-2 text-xs">
                            {processing ? __('Uploading...') : __('Upload')}
                        </Button>
                    </form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
