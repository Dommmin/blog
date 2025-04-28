import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CheckIcon } from 'lucide-react';
import { useState } from 'react';

type Language = {
    code: string;
    name: string;
    flag: string;
};

const languages: Language[] = [
    {
        code: 'en',
        name: 'English',
        flag: '🇺🇸',
    },
    {
        code: 'pl',
        name: 'Polski',
        flag: '🇵🇱',
    },
];

export function LanguageSwitcher() {
    // In a real implementation, this would come from your app's state/context
    const [currentLang, setCurrentLang] = useState('en');

    const switchLanguage = (langCode: string) => {
        setCurrentLang(langCode);

        // For a real implementation, you would:
        // 1. Set a cookie or localStorage value
        // 2. Redirect to the same page with the new locale in URL if using URL-based localization
        // 3. Or just refresh the page if using session-based localization

        // Example for URL-based switching (like mydomain.com/en/about -> mydomain.com/pl/about)
        // const currentPath = router.page.url.split('/').slice(2).join('/');
        // router.visit(`/${langCode}/${currentPath}`);

        // For now, just simulate the change
        console.log(`Language switched to ${langCode}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                    <span>{languages.find((lang) => lang.code === currentLang)?.flag}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => switchLanguage(language.code)}
                        className="flex cursor-pointer items-center gap-2"
                    >
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                        {currentLang === language.code && <CheckIcon className="ml-2 h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
