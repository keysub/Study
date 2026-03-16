import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

export default defineConfig({
  base: '/vue/',
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  server: {
    port: 8091,
    proxy: {
      // 1. WbsSetup 관련 요청 처리
      '/api': {
        target: 'https://localhost:443',
        changeOrigin: true,
        secure: false, // ⭐️ 자체 서명 인증서 허용 (매우 중요)
      },
      // 2. 메뉴 관련 요청 처리
      '/menus': {
        target: 'https://localhost:443',
        changeOrigin: true,
        secure: false, // ⭐️ 자체 서명 인증서 허용 (매우 중요)
      }
    },
    strictPort: true,
    host: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
