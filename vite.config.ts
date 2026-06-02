import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { VitePWA } from "vite-plugin-pwa";
import { inspectAttr } from "kimi-plugin-inspect-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  base: "./",
  plugins: [
    nodePolyfills({ include: ["buffer"], globals: { Buffer: true, global: true, process: true } }),
    inspectAttr(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png", "welcome-bg.jpg"],
      manifest: {
        name: "Premium FinLit App",
        short_name: "FinLit",
        description: "Gamified financial literacy simulator for the South African market — learn to invest, grow wealth, and master money in your language.",
        theme_color: "#D4AF37",
        background_color: "#0A0A0F",
        display: "standalone",
        orientation: "any",
        lang: "en-ZA",
        dir: "ltr",
        categories: ["education", "finance"],
        start_url: "./",
        scope: "./",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,jpg,webp,mp4}"],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          // Google Fonts stylesheet
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-css",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Google Fonts static files
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-static",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Local images — serve stale, revalidate in background
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "images-cache",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Split heavy third-party libs into their own cacheable chunks.
        // Browser re-downloads only the chunk that changed between deploys.
        manualChunks: {
          "vendor-react":       ["react", "react-dom"],
          "vendor-motion":      ["framer-motion"],
          "vendor-chart":       ["chart.js"],
          "vendor-html2canvas": ["html2canvas"],
          "vendor-zustand":     ["zustand"],
          "vendor-i18n":        ["i18next", "react-i18next"],
          "vendor-query":       ["@tanstack/react-query"],
          "vendor-dexie":       ["dexie"],
          "vendor-solana": [
            "@solana/web3.js",
            "@solana/wallet-adapter-base",
            "@solana/wallet-adapter-react",
            "@solana/wallet-adapter-react-ui",
            "@solana/wallet-adapter-phantom",
            "@solana/wallet-adapter-solflare",
          ],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Vitest configuration
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/shared/stores/**", "src/shared/hooks/**"],
    },
  },
});
