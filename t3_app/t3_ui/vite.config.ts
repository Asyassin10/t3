import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const isReadyToPublish = false;

const config = isReadyToPublish
  ? {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5177,
      strictPort: true,
      host: true,
      origin: "http://0.0.0.0:5177",
    },
    preview: {
      port: 5177,
      strictPort: true,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: true,
    }
  }
  : {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5177,
    },
    preview: {
      port: 5177,
      strictPort: true,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: true,
    },
  };

export default defineConfig(config);
