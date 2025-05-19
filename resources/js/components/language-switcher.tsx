import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { CheckIcon } from 'lucide-react';

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
    {
        code: 'de',
        name: 'Deutsch',
        flag: '🇩🇪',
    },
];

export function LanguageSwitcher() {
    const props = usePage().props;
    const currentLang = props.locale;

    const switchLanguage = (langCode: string) => {
        axios
            .post(route('locale.change', { locale: langCode }), {
                locale: langCode,
            })
            .then(() => {
                router.visit('/' + langCode + window.location.pathname.substring(3) + window.location.search);
            });
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
