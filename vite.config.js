import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    // server: {
    //     proxy: {
    //       '/api': {
    //         target: 'http://localhost:8000',
    //         changeOrigin: true,
    //         secure: false,
    //         // rewrite: (path) => path.replace(/^\/api/, ''),
    //       },
    //     },
    //   },
});
