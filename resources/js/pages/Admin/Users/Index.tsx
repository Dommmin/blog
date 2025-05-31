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
import { useTranslations } from '@/hooks/useTranslation';
import AdminLayout from '@/layouts/admin-layout';
import { User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PencilIcon, TrashIcon } from 'lucide-react';

interface UsersPageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
}

export default function Index({ users }: UsersPageProps) {
    const { __, locale } = useTranslations();

    const deleteUser = (id: number | string) => {
        router.delete(route('admin.users.destroy', { user: id }));
    };

    return (
        <AdminLayout>
            <Head title={__('Manage Users')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-background dark:border-border overflow-hidden rounded-lg shadow-sm dark:border">
                        <div className="dark:border-border border-b p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-medium">{__('Users')}</h3>
                            </div>
                            {users.data.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{__('Name')}</TableHead>
                                            <TableHead>{__('E-mail')}</TableHead>
                                            <TableHead className="flex justify-end">{__('Actions')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.data.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="font-medium">{user.name}</div>
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={route('admin.users.edit', { user: user.id })} prefetch="hover">
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
                                                                        {__('This action cannot be undone. This will permanently delete this user.')}
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>{__('Cancel')}</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => deleteUser(user.id)}>
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
                                    <h3 className="text-lg font-medium">{__('No users found')}</h3>
                                </div>
                            )}

                            {/* Pagination */}
                            {(users.prev_page_url || users.next_page_url) && (
                                <div className="mt-6">
                                    <Pagination className="justify-between">
                                        {users.prev_page_url ? (
                                            <Button variant="outline" asChild>
                                                <Link href={users.prev_page_url} prefetch>
                                                    {__('Previous')}
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button variant="outline" disabled>
                                                {__('Previous')}
                                            </Button>
                                        )}

                                        <div className="text-muted-foreground text-sm">
                                            {__('Page')} {users.current_page} {__('of')} {users.last_page}
                                        </div>

                                        {users.next_page_url ? (
                                            <Button variant="outline" asChild>
                                                <Link href={users.next_page_url} prefetch>
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
