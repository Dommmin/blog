import { useTranslations } from '@/hooks/useTranslation';

export default function AppFooter() {
    const { __ } = useTranslations();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-muted-foreground text-center text-sm leading-loose md:text-left">
                        &copy; {currentYear} {__('All rights reserved.')}
                    </p>
                </div>
                <nav className="flex gap-4 sm:gap-6">
                    {/*<Link href={route('about')} className="text-sm text-muted-foreground underline-offset-4 hover:underline">*/}
                    {/*    {__('About me')}*/}
                    {/*</Link>*/}
                    {/*<Link href={route('blog.index')} className="text-sm text-muted-foreground underline-offset-4 hover:underline">*/}
                    {/*    {__('Blog')}*/}
                    {/*</Link>*/}
                    {/*<Link href={route('contact')} className="text-sm text-muted-foreground underline-offset-4 hover:underline">*/}
                    {/*    {__('Contact')}*/}
                    {/*</Link>*/}
                </nav>
            </div>
        </footer>
    );
}
