import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { type RouteName, route } from 'ziggy-js';
import { useTranslations } from './hooks/useTranslation';

const { __ } = useTranslations();

const appName = __('PHP & DevOps Blog') + ' | ' + __('Dominik Jasiński');

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => {
            if (title === 'Home') {
                return appName;
            }
            return `${title} | ${appName}`;
        },
        resolve: (name) => {
            console.log('Resolving component:', name);
            const pages = import.meta.glob('./pages/**/*.{tsx,ts,jsx,js}');
            console.log('Available pages:', Object.keys(pages));
            return resolvePageComponent(`./pages/${name}.tsx`, pages);
        },
        setup: ({ App, props }) => {
            /* eslint-disable */
            // @ts-expect-error
            global.route<RouteName> = (name, params, absolute) =>
                route(name, params as any, absolute, {
                    // @ts-expect-error
                    ...page.props.ziggy,
                    // @ts-expect-error
                    location: new URL(page.props.ziggy.location),
                });
            /* eslint-enable */

            return <App {...props} />;
        },
    }),
);
