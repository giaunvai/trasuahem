import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  base: '/',
  server: {
    // Giảm tải cho trình theo dõi file: bỏ qua các thư mục không cần HMR
    watch: {
      ignored: ['**/dist/**', '**/public/images/**', '**/*.rar', '**/#BACKUP/**'],
    },
  },
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        promotion: resolve(import.meta.dirname, 'promotion.html'),
      },
    },
  },
})
