import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/helpers';
import { useTranslations } from '@/hooks/useTranslation';
import AdminLayout from '@/layouts/admin-layout';
import { Subscriber } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface UsersPageProps {
    subscribers: {
        data: Subscriber[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
}

export default function Index({ subscribers }: UsersPageProps) {
    const { __, locale } = useTranslations();

    return (
        <AdminLayout>
            <Head title={__('Manage Subscribers')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-background dark:border-border overflow-hidden rounded-lg shadow-sm dark:border">
                        <div className="dark:border-border border-b p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-medium">{__('Subscribers')}</h3>
                            </div>
                            {subscribers.data.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{__('ID')}</TableHead>
                                            <TableHead>{__('Locale')}</TableHead>
                                            <TableHead>{__('E-mail')}</TableHead>
                                            <TableHead>{__('Confirmed')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {subscribers.data.map((subscriber) => (
                                            <TableRow key={subscriber.id}>
                                                <TableCell>{subscriber.id}</TableCell>
                                                <TableCell>{subscriber.locale}</TableCell>
                                                <TableCell>{subscriber.email}</TableCell>
                                                <TableCell>{subscriber.confirmed_at ? formatDate(subscriber.confirmed_at, 'yyyy-MM-dd') : __('No')}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="p-6 text-center">
                                    <h3 className="text-lg font-medium">{__('No subscribers found')}</h3>
                                </div>
                            )}

                            {/* Pagination */}
                            {(subscribers.prev_page_url || subscribers.next_page_url) && (
                                <div className="mt-6">
                                    <Pagination className="justify-between">
                                        {subscribers.prev_page_url ? (
                                            <Button variant="outline" asChild>
                                                <Link href={subscribers.prev_page_url} prefetch>
                                                    {__('Previous')}
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button variant="outline" disabled>
                                                {__('Previous')}
                                            </Button>
                                        )}

                                        <div className="text-muted-foreground text-sm">
                                            {__('Page')} {subscribers.current_page} {__('of')} {subscribers.last_page}
                                        </div>

                                        {subscribers.next_page_url ? (
                                            <Button variant="outline" asChild>
                                                <Link href={subscribers.next_page_url} prefetch>
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
