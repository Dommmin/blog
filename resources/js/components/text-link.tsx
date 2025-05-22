import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import React from 'react';

export default function TextLink({ className = '', children, 'aria-label': ariaLabel, ...props }: React.ComponentProps<typeof Link>) {
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
