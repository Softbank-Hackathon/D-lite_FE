import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api'로 시작하는 모든 요청을 백엔드로 프록시
      "/api": {
        target: "https://api.clearplate.store",
        changeOrigin: true,
        secure: false,
      },
      // OAuth2 인증 요청도 프록시
      "/oauth2": {
        target: "https://api.clearplate.store",
        changeOrigin: true,
        secure: false,
      },
      // 로그인/로그아웃 요청도 프록시
      "/login": {
        target: "https://api.clearplate.store",
        changeOrigin: true,
        secure: false,
      },
      "/logout": {
        target: "https://api.clearplate.store",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
