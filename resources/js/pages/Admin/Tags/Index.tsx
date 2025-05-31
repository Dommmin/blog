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
import { Pagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/helpers';
import { useTranslations } from '@/hooks/useTranslation';
import AdminLayout from '@/layouts/admin-layout';
import { PageProps } from '@/types';
import { type Tag } from '@/types/blog';
import { type Flash, type Pagination as PaginationType } from '@/types/global';
import { Head, Link, router } from '@inertiajs/react';
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface PostsPageProps extends PageProps {
    posts: {
        data: Tag[];
        current_page: PaginationType['current_page'];
        last_page: PaginationType['last_page'];
        prev_page_url: PaginationType['prev_page_url'];
        next_page_url: PaginationType['next_page_url'];
    };
    flash: Flash;
}

export default function Index({ tags, flash }: PostsPageProps) {
    const { __ } = useTranslations();

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    const deleteTag = (id: number | string) => {
        router.delete(route('admin.tags.destroy', id));
    };

    return (
        <AdminLayout>
            <Head title={__('Manage Tags')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-background dark:border-border overflow-hidden rounded-lg shadow-sm dark:border">
                        <div className="dark:border-border border-b p-6">
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-lg font-medium">{__('Blog Tags')}</h3>
                                <Button size="sm" asChild>
                                    <Link href={route('admin.tags.create')} className="cursor-pointer" prefetch>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        {__('Create Tag')}
                                    </Link>
                                </Button>
                            </div>
                            {tags.data.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{__('Title')}</TableHead>
                                            <TableHead>{__('Created')}</TableHead>
                                            <TableHead className="text-right">{__('Actions')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tags.data.map((tag: Tag) => (
                                            <TableRow key={tag.id}>
                                                <TableCell>
                                                    <div className="font-medium">{tag.name}</div>
                                                </TableCell>
                                                <TableCell>{formatDate(tag.created_at, 'yyyy-MM-dd')}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={route('admin.tags.edit', { tag: tag.id })} prefetch="hover">
                                                                <PencilIcon className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button size="sm" variant="destructive">
                                                                    <TrashIcon className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>{__('Are you sure?')}</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        {__('This action cannot be undone. This will permanently delete this tag.')}
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>{__('Cancel')}</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => deleteTag(tag.id)}>
                                                                        {__('Delete')}
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="p-6 text-center">
                                    <h3 className="text-lg font-medium">{__('No tags found')}</h3>
                                    <p className="text-muted-foreground mt-2 text-sm">{__('You have not created any tags yet.')}</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {(tags.prev_page_url || tags.next_page_url) && (
                                <div className="mt-6">
                                    <Pagination className="justify-between">
                                        {tags.prev_page_url ? (
                                            <Button variant="outline" asChild>
                                                <Link href={tags.prev_page_url}>{__('Previous')}</Link>
                                            </Button>
                                        ) : (
                                            <Button variant="outline" disabled>
                                                {__('Previous')}
                                            </Button>
                                        )}

                                        {tags.next_page_url ? (
                                            <Button variant="outline" asChild>
                                                <Link href={tags.next_page_url}>{__('Next')}</Link>
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
