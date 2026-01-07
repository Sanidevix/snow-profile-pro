import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SnowStrat Field - Perfiles Estratigráficos Nivales',
        short_name: 'SnowStrat Field',
        description: 'Toma de datos de perfiles de nieve - Estándar AEMET',
        theme_color: '#1e40af',
        background_color: '#f5f7fa',
        display: 'standalone',
        icons: [
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg}'] }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
