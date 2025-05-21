import { cn } from '@/lib/utils';
import React, { ReactNode, useEffect, useRef, useState } from 'react';

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out';

interface AnimateOnViewProps {
    children: ReactNode;
    animation?: AnimationType;
    duration?: string;
    delay?: string;
    threshold?: number;
    className?: string;
    once?: boolean;
}
export function AnimateOnView({
    children,
    animation = 'fade-up',
    duration = 'duration-500',
    delay = 'delay-0',
    threshold = 0.1,
    className = '',
    once = true,
}: AnimateOnViewProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Mapowanie typów animacji na klasy CSS
    const animationClasses: Record<AnimationType, string> = {
        'fade-up': 'transform translate-y-8 opacity-0',
        'fade-down': 'transform -translate-y-8 opacity-0',
        'fade-left': 'transform translate-x-8 opacity-0',
        'fade-right': 'transform -translate-x-8 opacity-0',
        'zoom-in': 'transform scale-95 opacity-0',
        'zoom-out': 'transform scale-105 opacity-0',
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) {
                        observer.unobserve(entry.target);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            {
                threshold,
                rootMargin: '0px',
            },
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, once]);

    return (
        <div
            ref={ref}
            className={cn('transition', duration, delay, !isVisible ? animationClasses[animation] : 'transform-none opacity-100', className)}
        >
            {children}
        </div>
    );
}

interface AnimateStaggerProps {
    children: ReactNode;
    animation?: AnimationType;
    duration?: string;
    stagger?: number;
    className?: string;
}

export function AnimateStagger({ children, animation = 'fade-up', duration = 'duration-500', stagger = 100, className = '' }: AnimateStaggerProps) {
    return (
        <div className={className}>
            {React.Children.map(children, (child, index) => {
                if (!React.isValidElement(child)) return child;

                const delayClass = `delay-${index * stagger}`;

                return (
                    <AnimateOnView animation={animation} duration={duration} delay={delayClass}>
                        {child}
                    </AnimateOnView>
                );
            })}
        </div>
    );
}

type AnimateType = 'pulse' | 'bounce' | 'spin' | 'ping';

interface AnimateProps {
    children: ReactNode;
    animation?: AnimateType;
    duration?: string;
    delay?: string;
    className?: string;
}

export function Animate({ children, animation = 'pulse', duration = 'duration-1000', delay = 'delay-0', className = '' }: AnimateProps) {
    const animationClasses: Record<AnimateType, string> = {
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        spin: 'animate-spin',
        ping: 'animate-ping',
    };

    return <div className={cn(animationClasses[animation], duration, delay, className)}>{children}</div>;
}
