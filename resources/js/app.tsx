import '../css/app.css';

import '@/helpers';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

initializeTheme();

const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm('New content available. Reload?')) {
            updateSW();
        }
    },
    onOfflineReady() {
        console.log('App ready to work offline');
    },
});

const preloadCriticalComponents = () => {
    const preload = (callback: IdleRequestCallback) => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(callback);
        } else {
            setTimeout(callback, 1);
        }
    };

    preload(() => {
        const criticalComponents = [
            () => import('./layouts/app-layout'),
            () => import('./components/PostCard'),
            () => import('./components/AnimateOnView'),
        ];

        Promise.all(criticalComponents.map(component => component().catch(() => null)));
    });
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const renderApp = () => {
            if (el.hasChildNodes()) {
                hydrateRoot(el, <App {...props} />);
            } else {
                createRoot(el).render(<App {...props} />);
            }
        };

        renderApp();

        preloadCriticalComponents();
    },
    progress: {
        delay: 250,
        color: '#29d',
        includeCSS: true,
        showSpinner: false,
    },
    // @ts-expect-error ssr not yet in types
    ssr: true,
});