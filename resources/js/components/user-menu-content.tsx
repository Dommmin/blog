import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { useTranslations } from '@/hooks/useTranslation';
import { type User } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutDashboard, LogOut, PanelBottom, Settings } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const { __, locale } = useTranslations();
    const cleanup = useMobileNavigation();

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                {route().current('admin.*') ? (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={route('home', { locale: locale })} as="button" prefetch onClick={cleanup}>
                            <LayoutDashboard className="mr-2" />
                            {__('Home')}
                        </Link>
                    </DropdownMenuItem>
                ) : user.admin ? (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={route('admin.home')} as="button" prefetch onClick={cleanup}>
                            <PanelBottom className="mr-2" />
                            {__('Panel')}
                        </Link>
                    </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        {__('Settings')}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" method="post" href={route('logout')} as="button" onClick={cleanup}>
                    <LogOut className="mr-2" />
                    {__('Log out')}
                </Link>
            </DropdownMenuItem>
        </>
    );
}
