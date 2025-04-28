import { usePage } from '@inertiajs/react';

type Replacements = Record<string, string | number>;

export function useTranslation() {
    // Add type assertion to access the props
    const { translations, locale } = usePage().props as any;

    const t = (key: string, replacements: Replacements = {}) => {
        // Handle nested keys like 'messages.welcome'
        let translation = key.split('.').reduce((acc: any, part) => {
            return acc?.[part];
        }, translations);

        if (!translation) return key;

        // Handle replacements like :name or :count
        Object.keys(replacements).forEach((key) => {
            translation = translation.replace(new RegExp(`:${key}`, 'g'), replacements[key].toString());
        });

        return translation;
    };

    return {
        t,
        locale,
    };
}
