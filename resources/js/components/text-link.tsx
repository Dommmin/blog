import { Link, LinkProps } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export default function TextLink({ className = '', children, 'aria-label': ariaLabel, ...props }: LinkProps & { 'aria-label'?: string }) {
    return (
        <Link
            className={cn(
                'text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500',
                className,
            )}
            aria-label={ariaLabel}
            {...props}
        >
            {children}
        </Link>
    );
}
