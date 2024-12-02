/** @type {import('vite').UserConfig} */
import { VitePWA } from "vite-plugin-pwa";

export default {
    base: "./",
    plugins: [
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "Sudoku by ML",
                short_name: "Sudoku",
                description: "A Sudoku demo app",
                theme_color: "#ffffff",
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
                ],
            },
        }),
    ],
};
