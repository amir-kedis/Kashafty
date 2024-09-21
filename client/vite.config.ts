import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  process.env = { ...process.env, ...env };

  const port = parseInt(env.VITE_PORT) || 3000;

  console.log("Vite development server is running at port", port);
  console.log("backend url is", env.VITE_API_URL);

  return {
    plugins: [react()],
    server: {
      port: port,
    },
    define: {
      "import.meta.env": JSON.stringify(env),
    },
  };
});
