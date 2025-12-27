import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Visualizador de bundle (opcional, para debug)
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    // Optimizaciones para reducir tamaño del bundle
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.logs en producción
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    // Code splitting manual para chunks más pequeños
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks separados
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['motion/react'],
          'vendor-forms': ['react-hook-form@7.55.0'],
          'vendor-ui': ['sonner@2.0.3', 'react-helmet-async'],
          // Admin separado (solo se carga si vas a /admin)
          'admin': [
            './pages/admin/AdminDashboard.tsx',
            './pages/admin/AdminLogin.tsx',
            './pages/admin/ContentManager.tsx',
            './pages/admin/MenuManager.tsx',
            './pages/admin/SettingsManager.tsx',
            './pages/admin/UserManager.tsx',
            './pages/admin/BlogManager.tsx',
            './pages/admin/CustomPagesManager.tsx',
            './pages/admin/GiftCardManager.tsx',
            './pages/admin/ImageLibrary.tsx',
            './pages/admin/MessagesManager.tsx',
            './pages/admin/RedirectsManager.tsx',
          ],
        },
      },
    },
    // Aumentar límite de advertencia de chunk size
    chunkSizeWarningLimit: 1000,
    // Source maps solo en desarrollo
    sourcemap: false,
  },
  // Optimizaciones de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'motion/react',
    ],
    exclude: ['lucide-react'], // Tree-shaking más agresivo para iconos
  },
  // Performance
  server: {
    hmr: {
      overlay: false,
    },
  },
});
