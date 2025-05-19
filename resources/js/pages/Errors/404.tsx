import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';

export default function Error404() {
    const page = usePage();
    return (
        <div className="flex min-h-screen items-center justify-center py-12">
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <div className="text-primary mb-4 text-9xl font-bold">404</div>
                <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">Page Not Found</h1>
                <p className="mb-8 text-xl text-gray-600 dark:text-gray-400">Oops! The page you're looking for doesn't exist or has been moved.</p>
                <Button asChild>
                    <Link href={route('home', { locale: page.props.locale })} prefetch>
                        Back to Homepage
                    </Link>
                </Button>
            </div>
        </div>
    );
}
