import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: process.env.ADDR || "127.0.0.1";
    port: process.env.PORT || 3000;
  },
  plugins: [vue()],
})
