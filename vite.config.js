import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',  // Your project root (where package.json is)
  publicDir: 'public',  // Keep using your public folder
  build: {
    outDir: 'dist',  // Vite builds to 'dist' instead of 'build'
  },
  server: {
    port: 3000
  }
})