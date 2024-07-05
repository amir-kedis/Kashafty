import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    // proxy: {
    //   "/api": {
    //     // target: "http://localhost:5000",
    //     target:
    //       process.env.NODE_ENV === "production"
    //         ? "https://scouts-managment-system-api-dev.onrender.com"
    //         : "http://localhost:5000",
    //     changeOrigin: true,
    //   },
    // },
  },
});
