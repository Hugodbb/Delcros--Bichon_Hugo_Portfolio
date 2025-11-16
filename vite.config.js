import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Chemin de base pour les assets (relatif pour le déploiement)
  base: './',
  
  // Configuration du serveur de développement
  server: {
    port: 3000,
    open: true,
    host: true
  },
  
  // Configuration de la construction
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  
  // Alias pour les imports
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  
  // Optimisation des dépendances
  optimizeDeps: {
    include: ['three'],
    esbuildOptions: {
      target: 'es2020'
    }
  }
});
