import type { StartOptions } from 'pm2';

const config: { apps: StartOptions[] } = {
    apps: [
        {
            name: 'inertia-ssr',
            script: './bootstrap/ssr/ssr.js',
            instances: 2,
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
                PORT: '13714',
                APP_URL: 'https://laravel.bieda.it',
                // Node 22 specific optimizations
                NODE_OPTIONS: '--max-old-space-size=512 --experimental-json-modules'
            },
            time: true,
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',
            // Node 22 specific flags
            node_args: [
                '--max-old-space-size=512',
                '--experimental-json-modules',
                '--enable-source-maps'
            ],
            // Better process management for Node 22
            kill_timeout: 5000,
            restart_delay: 1000,
            max_restarts: 10,
            // Logging configuration
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            merge_logs: true,
        }
    ],
};

export default config;
