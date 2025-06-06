import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { __, locale } = useTranslations();

    if (typeof window === 'undefined') {
        return null;
    }

    const sidebarNavItems: NavItem[] = [
        {
            title: __('Profile'),
            href: route('profile.edit', { locale }),
            current: route().current('profile.edit'),
            icon: null,
        },
        {
            title: __('Password'),
            href: route('password.edit', { locale }),
            current: route().current('password.edit'),
            icon: null,
        },
        {
            title: __('Appearance'),
            href: route('appearance', { locale }),
            current: route().current('appearance'),
            icon: null,
        },
    ];

    return (
        <div className="px-4 py-6">
            <Heading title={__('Settings')} description={__('Manage your profile and account settings')} />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': item.current,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
