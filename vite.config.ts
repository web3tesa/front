import { defineConfig, loadEnv } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

import manifest from './src/manifest'

const envFiles = {
  development: '.env.development',
  production:".env.production"
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    define: {
      'process.env': loadEnv(mode, process.cwd(), envFiles[mode])
    },
    build: {
      emptyOutDir: true,
      outDir: 'build',
      rollupOptions: {
        // manualChunks(id){
        //   console.log('🚀 ~ file: vite.config.ts ~ manualChunks ~ id', id)
        //   if (id.includes('InjectedScript')) {
        //     return 'injectpage'
        //   }
        // },
        // output: {
        //   chunkFileNames: 'assets/chunk-[hash].js',
        // },

        output: {
          chunkFileNames: (chunkInfo) => {
            if (chunkInfo.name === 'injectpage') {
              return 'injectpage.js';
            }
            return 'assets/[name].js';  
          },
          entryFileNames: (entryInfo) => {
            if (entryInfo.name === 'injectpage') {
              return 'injectpage.js';
            }
            return 'assets/[name].js'; 
          },
        },
        manualChunks(id) {
          console.log('🚀 ~ file: vite.config.ts ~ manualChunks ~ id', id);
          if (id.includes('InjectedScript')) {
            return 'injectpage';
          }
        },
      },

    },
    server: { port: 5173, strictPort: true, hmr: { port: 5173, }, },
    plugins: [crx({ manifest }), react()],
  }
})
