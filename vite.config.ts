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
  }
})