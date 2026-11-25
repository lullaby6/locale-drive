import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from "vite-tsconfig-paths"
import tailwindcss from '@tailwindcss/vite'
import offlineIcons from './iconsPlugin'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // The app always calls the API with relative URLs (/api, /storage), so the built
  // version works from any device on the LAN. In dev, Vite forwards them to the Express server.
  const apiTarget = env.VITE_API_URL || 'http://localhost:3000';

  return {
    plugins: [react(), tsconfigPaths(), tailwindcss(), offlineIcons(fileURLToPath(new URL('./src', import.meta.url)))],
    // Explicit alias: vite-tsconfig-paths can miss "@/..." on Windows when the drive letter case differs (d: vs D:).
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      port: parseInt(env.PORT || '5173'),
      open: true,
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
        '/storage': { target: apiTarget, changeOrigin: true },
      },
    },
    build: {
      outDir: '../public',
      emptyOutDir: true,
    },
  };
});
