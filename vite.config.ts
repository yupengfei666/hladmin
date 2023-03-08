import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/", //这里原来是./ 现在改为/进行测试  改为/ 页面可以正常显示出来
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "localhost",
    port: 3001, // 端口号
    https: false,
    cors: true, // 默认启用并允许任何源
    open: true, // 在服务器启动时自动在浏览器中打开应用程序
    proxy: {
      "/api": {
        target: "http://36.139.138.80:7456", //代理接口   上线的 开发也使用这个
        // target: "http://192.168.0.200:7456", //这个不在使用
        changeOrigin: true,
        ws: true,
        secure: true,
      },
    },
  },
  optimizeDeps: {
    //检测需要预构建的依赖项
    entries: [],
  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
})
