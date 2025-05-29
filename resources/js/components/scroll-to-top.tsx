import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled down 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <Button
            variant="outline"
            size="icon"
            className={cn(
                'bg-background/80 hover:bg-background fixed right-6 bottom-6 z-50 rounded-full backdrop-blur-sm transition-all duration-300',
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0',
            )}
            onClick={scrollToTop}
            aria-label="Scroll to top"
        >
            <Icon iconNode={ArrowUp} className="h-4 w-4" />
        </Button>
    );
}
