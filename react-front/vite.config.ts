import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/react/', 
  plugins: [react()],
  server: {
	port: 8090,
    proxy: {
		// /api로 시작하는 모든 요청을 백엔드로 전달
       '/api': {
		  target: 'https://localhost:443',
		  changeOrigin: true,
		  secure: false,
		},
		
      '/menus': { // '/menus'로 시작하는 요청은
        target: 'https://localhost:443', // 스프링 서버로 보낸다
        changeOrigin: true,
		secure: false,
      }
    },
	strictPort: true,
	host: true
  }
})
