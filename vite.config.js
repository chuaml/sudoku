/** @type {import('vite').UserConfig} */
import { VitePWA } from "vite-plugin-pwa";
// import { fileURLToPath } from 'node:url';
// import { dirname, resolve } from "node:path";

// const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    base: "./",
    plugins: [
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "Sudoku by ML",
                short_name: "Sudoku",
                description: "A Sudoku demo app",
                theme_color: "##e4c7f8",
                icons: [
                    {
                        "src": "icons/manifest-icon-192.maskable.png",
                        "sizes": "192x192",
                        "type": "image/png",
                        "purpose": "any",
                    },
                    {
                        "src": "icons/manifest-icon-192.maskable.png",
                        "sizes": "192x192",
                        "type": "image/png",
                        "purpose": "maskable",
                    },
                    {
                        "src": "icons/manifest-icon-512.maskable.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "any",
                    },
                    {
                        "src": "icons/manifest-icon-512.maskable.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "maskable",
                    },
                ],
            },
            workbox: {
                // globPatterns: ['**/*.{js,css,html,ico,png,svg}'], // precache, eager load and cache
                runtimeCaching: [
                    {
                        urlPattern: /\.(png|jpg|jpeg|svg|gif)$/i,
                        handler: "StaleWhileRevalidate", // Cache StrategyName
                        options: {
                            cacheName: "image-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 3600 * 24 * 2,
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        urlPattern: /[^?]*?/i,
                        handler: "NetworkFirst", // Cache StrategyName
                        options: {
                            cacheName: "page-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 0,
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
                navigateFallbackDenylist: [
                    /^[^?]+?/  // anything with querystring do not use fallback index.html as cache when cach miss
                ],
            },
        }),
    ],
    appType: 'mpa', // shows 404 for non-existing url path and navigate to the correct xyz.html files when url is enter
    build: {
        rollupOptions: {
            input: { // url mapping
                // main: resolve(__dirname, 'index.html'), // example default index page
                // some_other_name: 'punch-game.html', // rename does not work for .html file, original default file name will always be use as path instead

                main: 'index.html',
                'punch-game': 'punch-game.html', // default file name mapping

            },
        },
    },
};
