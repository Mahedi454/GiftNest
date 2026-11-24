import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Point the dev proxy at another API with VITE_PROXY=http://localhost:5055 npm run dev
const api = process.env.VITE_PROXY || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': api, '/uploads': api },
  },
});
