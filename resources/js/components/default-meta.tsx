import { Head } from '@inertiajs/react';
import { useTranslations } from '@/hooks/useTranslation';

interface DefaultMetaProps {
    title?: string;
    description?: string;
}

export default function DefaultMeta({ title, description }: DefaultMetaProps) {
    const { __ } = useTranslations();
    const defaultTitle = title || __('PHP & DevOps Blog');
    const defaultDescription = description || __('Technical insights, best practices, and deep dives into Laravel, Symfony, and modern DevOps solutions');

    return (
        <Head>
            <title>{defaultTitle}</title>
            <meta name="description" content={defaultDescription} />
            <meta property="og:title" content={defaultTitle} />
            <meta property="og:description" content={defaultDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={window.location.href} />
            <link rel="canonical" href={window.location.href} />
            <meta name="robots" content="index, follow" />
        </Head>
    );
}