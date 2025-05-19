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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslations } from '@/hooks/useTranslation';
import AdminLayout from '@/layouts/admin-layout';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Post {
    id: number;
    title: string;
    slug: string;
    published_at: string | null;
    created_at: string;
}

interface PostsPageProps extends PageProps {
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    flash: {
        success?: string;
    };
}

export default function Index({ posts, flash }: PostsPageProps) {
    const { __, locale } = useTranslations();
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    const deletePost = (id: number | string) => {
        router.delete(route('admin.posts.destroy', { post: id }));
    };

    return (
        <AdminLayout>
            <Head title={__('Manage Posts')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-background dark:border-border overflow-hidden rounded-lg shadow-sm dark:border">
                        <div className="dark:border-border border-b p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-medium">{__('Blog Posts')}</h3>
                                <Button asChild>
                                    <Link href={route('admin.posts.create')} className="cursor-pointer" prefetch>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        {__('Create Post')}
                                    </Link>
                                </Button>
                            </div>
                            {posts.data.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{__('Title')}</TableHead>
                                            <TableHead>{__('Status')}</TableHead>
                                            <TableHead>{__('Created')}</TableHead>
                                            <TableHead className="text-right">{__('Actions')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {posts.data.map((post) => (
                                            <TableRow key={post.id}>
                                                <TableCell>
                                                    <div className="font-medium">{post.title}</div>
                                                    <div className="text-muted-foreground text-sm">{post.slug}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={post.published_at ? 'success' : 'warning'}>
                                                        {post.published_at ? 'Published' : 'Draft'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{post.created_at ? format(new Date(post.created_at), 'yyyy-MM-dd') : ''}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={route('blog.show', { post: post.slug, locale: locale })} prefetch="hover">
                                                                <EyeIcon className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={route('admin.posts.edit', { post: post.slug })} prefetch="hover">
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
                                                                        {__('This action cannot be undone. This will permanently delete this post.')}
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>{__('Cancel')}</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => deletePost(post.slug)}>
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
                                    <h3 className="text-lg font-medium">No posts found</h3>
                                    <p className="text-muted-foreground mt-2 text-sm">You have not created any posts yet.</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {(posts.prev_page_url || posts.next_page_url) && (
                                <div className="mt-6">
                                    <Pagination className="justify-between">
                                        {posts.prev_page_url ? (
                                            <Button variant="outline" asChild>
                                                <Link href={posts.prev_page_url} prefetch>
                                                    Previous
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button variant="outline" disabled>
                                                Previous
                                            </Button>
                                        )}

                                        {posts.next_page_url ? (
                                            <Button variant="outline" asChild>
                                                <Link href={posts.next_page_url} prefetch>
                                                    Next
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button variant="outline" disabled>
                                                Next
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
