// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import * as path from 'path'

dotenv.config()

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // SCSS 전역 변수 및 믹스인 등을 설정할 수 있습니다.
      },
    },
  },
  // GitHub Pages에 배포할 때 필요합니다.
  base: '/amdena/', // 'your-repo-name'을 실제 리포지토리 이름으로 변경하세요.
})