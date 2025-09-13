import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/school-dining-management/', // 👈 এটা যোগ করতে হবে
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
