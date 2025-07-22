import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'EchoMeo Learning App',
        short_name: 'EchoMeo',
        description: 'Multi-language learning platform with vocabulary study tools for Chinese, Vietnamese, and English',
        theme_color: '#3b82f6',
        background_color: '#1f2937',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/EchoMeo-learning-app/',
        start_url: '/EchoMeo-learning-app/',
        icons: [
          {
            src: '/EchoMeo-learning-app/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/EchoMeo-learning-app/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  base: '/EchoMeo-learning-app/', // This ensures all assets have the correct base path
  server: {
    host: '0.0.0.0', // Allow external connections
    port: 5173,
    strictPort: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor library chunking
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('zustand')) {
              return 'vendor-state';
            }
            return 'vendor-other';
          }
          
          // Vocabulary data chunking - split by individual levels for better performance
          if (id.includes('assets/data/hsk/')) {
            if (id.includes('hsk1')) return 'hsk-level-1';
            if (id.includes('hsk2')) return 'hsk-level-2';
            if (id.includes('hsk3')) return 'hsk-level-3';
            if (id.includes('hsk4')) return 'hsk-level-4';
            if (id.includes('hsk5')) return 'hsk-level-5';
            if (id.includes('hsk6')) return 'hsk-level-6';
            if (id.includes('hsk7')) return 'hsk-level-7';
          }
          
          if (id.includes('assets/data/vietnamese/')) {
            if (id.includes('vietnamese_1')) return 'vietnamese-level-1';
            if (id.includes('vietnamese_2')) return 'vietnamese-level-2';
            if (id.includes('vietnamese_3')) return 'vietnamese-level-3';
            if (id.includes('vietnamese_4')) return 'vietnamese-level-4';
            if (id.includes('vietnamese_5')) return 'vietnamese-level-5';
            if (id.includes('vietnamese_6')) return 'vietnamese-level-6';
          }
        }
      }
    },
    // Increase chunk size warning limit for vocabulary data (HSK 7 is naturally large)
    chunkSizeWarningLimit: 6000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  }
})