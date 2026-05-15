import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})