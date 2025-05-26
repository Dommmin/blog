import { PostVisits } from '@/components/PostVisits';
import { Toaster } from '@/components/ui/sonner';
import AdminLayout from '@/layouts/admin-layout';
import { type VisitStats } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    visitStats: VisitStats[];
}

export default function Home({ visitStats }: Props) {
    return (
        <AdminLayout>
            <Toaster />
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 lg:grid-cols-2">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative h-[400px] overflow-hidden rounded-xl border p-4">
                        <PostVisits visitStats={visitStats} />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative h-[400px] overflow-hidden rounded-xl border p-4">
                        <PostVisits visitStats={visitStats} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
