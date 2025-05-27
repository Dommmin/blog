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
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowDownIcon, ArrowUpIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface UsersPageProps extends PageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    filters: {
        sort_by: string;
        sort_direction: string;
    };
    flash: {
        success?: string;
    };
}

export default function Index({ users, filters, flash }: UsersPageProps) {
    const { __ } = useTranslations();

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    const deleteUser = (id: number) => {
        router.delete(route('admin.users.destroy', id));
    };

    const handleSort = (column: string) => {
        const newDirection = filters.sort_by === column && filters.sort_direction === 'asc' ? 'desc' : 'asc';
        router.get(
            route('admin.users.index'),
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

    return (
        <AdminLayout>
            <Head title={__('Manage Users')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-background dark:border-border overflow-hidden rounded-lg shadow-sm dark:border">
                        <div className="dark:border-border border-b p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-medium">{__('Users')}</h3>
                                <Button asChild>
                                    <Link href={route('admin.users.create')} className="cursor-pointer" prefetch>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        {__('Create User')}
                                    </Link>
                                </Button>
                            </div>
                            {users.data.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                <Button variant="ghost" onClick={() => handleSort('name')} className="flex items-center gap-1">
                                                    {__('Name')}
                                                    {getSortIcon('name')}
                                                </Button>
                                            </TableHead>
                                            <TableHead>
                                                <Button variant="ghost" onClick={() => handleSort('email')} className="flex items-center gap-1">
                                                    {__('Email')}
                                                    {getSortIcon('email')}
                                                </Button>
                                            </TableHead>
                                            <TableHead>
                                                <Button variant="ghost" onClick={() => handleSort('role')} className="flex items-center gap-1">
                                                    {__('Role')}
                                                    {getSortIcon('role')}
                                                </Button>
                                            </TableHead>
                                            <TableHead className="text-center">{__('Actions')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.data.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="font-medium">{user.name}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{user.email}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium capitalize">{user.role}</div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={route('admin.users.edit', user.id)} prefetch="hover">
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
                                    <h3 className="text-lg font-medium">No users found</h3>
                                    <p className="text-muted-foreground mt-2 text-sm">You have not created any users yet.</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {(users.prev_page_url || users.next_page_url) && (
                                <div className="mt-6">
                                    <Pagination className="justify-between">
                                        {users.prev_page_url ? (
                                            <Button variant="outline" asChild>
                                                <Link href={users.prev_page_url} prefetch>
                                                    Previous
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button variant="outline" disabled>
                                                Previous
                                            </Button>
                                        )}

                                        <div className="text-muted-foreground text-sm">
                                            {__('Page')} {users.current_page} {__('of')} {users.last_page}
                                        </div>

                                        {users.next_page_url ? (
                                            <Button variant="outline" asChild>
                                                <Link href={users.next_page_url} prefetch>
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