import '../css/app.css';

import '@/helpers';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { initializeTheme } from './hooks/use-appearance';
import NProgress from 'nprogress';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// PWA
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

// Preload critical components
const preloadCriticalComponents = async () => {
    const criticalComponents = [
        () => import('./pages/home'),
        () => import('./layouts/app-layout'),
        () => import('./components/PostCard'),
    ];

    await Promise.all(
        criticalComponents.map(component => component())
    );
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        preloadCriticalComponents().then(() => {
            if (el.hasChildNodes()) {
                hydrateRoot(el, <App {...props} />);
            } else {
                createRoot(el).render(<App {...props} />);
            }
            NProgress.done();
        });
    },
    progress: {
        delay: 0,
        color: '#29d',
        includeCSS: true,
        showSpinner: false,
    },
    // @ts-expect-error ssr not yet in types
    ssr: true,
});

initializeTheme();
