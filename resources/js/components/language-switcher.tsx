import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTranslations } from '@/hooks/useTranslation';
import { router, usePage } from '@inertiajs/react';
import { CheckIcon } from 'lucide-react';

type Language = {
    code: string;
    name: string;
    flag: string;
};

export function LanguageSwitcher() {
    const props = usePage().props;
    const currentLang = props.locale;
    const { __, locale } = useTranslations();

    const languages: Language[] = [
        {
            code: 'en',
            name: __('English'),
            flag: '🇺🇸',
        },
        {
            code: 'pl',
            name: __('Polish'),
            flag: '🇵🇱',
        },
        {
            code: 'de',
            name: __('Deutsch'),
            flag: '🇩🇪',
        },
    ];

    const switchLanguage = (langCode: string) => {
        router.post(route('locale.change', { locale }), {
            locale: langCode,
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
                        disabled={language.code === currentLang}
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
