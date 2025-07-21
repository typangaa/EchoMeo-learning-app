import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/vietnamese-chinese-learning/', // This ensures all assets have the correct base path
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
          
          // Vocabulary data chunking by level
          if (id.includes('assets/data/hsk/')) {
            if (id.includes('hsk1') || id.includes('hsk2') || id.includes('hsk3')) {
              return 'hsk-1-3';
            }
            if (id.includes('hsk4') || id.includes('hsk5') || id.includes('hsk6')) {
              return 'hsk-4-6';
            }
            if (id.includes('hsk7')) {
              return 'hsk-7';
            }
          }
          
          if (id.includes('assets/data/vietnamese/')) {
            if (id.includes('vietnamese_1') || id.includes('vietnamese_2') || id.includes('vietnamese_3')) {
              return 'vietnamese-1-3';
            }
            if (id.includes('vietnamese_4') || id.includes('vietnamese_5') || id.includes('vietnamese_6')) {
              return 'vietnamese-4-6';
            }
          }
        }
      }
    },
    // Increase chunk size warning limit since we're optimizing intentionally
    chunkSizeWarningLimit: 1000,
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