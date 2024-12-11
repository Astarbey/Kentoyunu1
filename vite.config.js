import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Soru Cevap Uygulaması',
        short_name: 'SoruCevap',
        description: 'Yöneticilerin soru hazırlayıp, öğrencilerin yanıtladığı bir uygulama.',
        theme_color: '#d4af37',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  base: '/Kentoyunu1/', // Burayı GitHub depo adınızla değiştirin
});
