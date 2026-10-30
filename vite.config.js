import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Eguru-Portfolio/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
}))
