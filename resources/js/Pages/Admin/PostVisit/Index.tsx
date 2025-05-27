import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslations } from '@/hooks/useTranslation';
import AdminLayout from '@/layouts/admin-layout';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface Post {
    id: number;
    title: string;
    slug: string;
}

interface PostVisit {
    id: number;
    post: Post;
    ip_address: string;
    user_agent: string;
    created_at: string;
}

interface PostVisitsPageProps extends PageProps {
    visits: {
        data: PostVisit[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    filters: {
        sort_by: string;
        sort_direction: string;
    };
}

export default function Index({ visits, filters }: PostVisitsPageProps) {
    const { __ } = useTranslations();

    const handleSort = (column: string) => {
        const newDirection = filters.sort_by === column && filters.sort_direction === 'asc' ? 'desc' : 'asc';
        router.get(
            route('admin.visits.index'),
            {
                sort_by: column,
                sort_direction: newDirection,
            },
            { preserveState: true },
        );
    };

    const getSortIcon = (column: string) => {
        if (filters.sort_by !== column) return null;
        return filters.sort_direction === 'asc' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString();
    };

    return (
        <AdminLayout>
            <Head title={__('Post Visits')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-background dark:border-border overflow-hidden rounded-lg shadow-sm dark:border">
                        <div className="dark:border-border border-b p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-medium">{__('Post Visits')}</h3>
                            </div>
                            {visits.data.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                <Button variant="ghost" onClick={() => handleSort('post.title')} className="flex items-center gap-1">
                                                    {__('Post')}
                                                    {getSortIcon('post.title')}
                                                </Button>
                                            </TableHead>
                                            <TableHead>
                                                <Button variant="ghost" onClick={() => handleSort('ip_address')} className="flex items-center gap-1">
                                                    {__('IP Address')}
                                                    {getSortIcon('ip_address')}
                                                </Button>
                                            </TableHead>
                                            <TableHead>
                                                <Button variant="ghost" onClick={() => handleSort('user_agent')} className="flex items-center gap-1">
                                                    {__('User Agent')}
                                                    {getSortIcon('user_agent')}
                                                </Button>
                                            </TableHead>
                                            <TableHead>
                                                <Button variant="ghost" onClick={() => handleSort('created_at')} className="flex items-center gap-1">
                                                    {__('Visited At')}
                                                    {getSortIcon('created_at')}
                                                </Button>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {visits.data.map((visit) => (
                                            <TableRow key={visit.id}>
                                                <TableCell>
                                                    <Link
                                                        href={route('blog.show', { post: visit.post.slug })}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        {visit.post.title}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{visit.ip_address}</TableCell>
                                                <TableCell>{visit.user_agent}</TableCell>
                                                <TableCell>{formatDate(visit.created_at)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="p-6 text-center">
                                    <h3 className="text-lg font-medium">No visits found</h3>
                                    <p className="text-muted-foreground mt-2 text-sm">There are no post visits recorded yet.</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {(visits.prev_page_url || visits.next_page_url) && (
                                <div className="mt-6">
                                    <Pagination className="justify-between">
                                        {visits.prev_page_url ? (
                                            <Button variant="outline" asChild>
                                                <Link href={visits.prev_page_url} prefetch>
                                                    Previous
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button variant="outline" disabled>
                                                Previous
                                            </Button>
                                        )}

                                        <div className="text-muted-foreground text-sm">
                                            {__('Page')} {visits.current_page} {__('of')} {visits.last_page}
                                        </div>

                                        {visits.next_page_url ? (
                                            <Button variant="outline" asChild>
                                                <Link href={visits.next_page_url} prefetch>
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