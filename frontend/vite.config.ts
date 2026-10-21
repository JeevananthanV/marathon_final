import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    server: {
      // Let the dev server serve API calls same-origin (works on every device,
      // not just this PC). Production/proxied traffic hits the backend directly.
      proxy: {
        "/api": { target: "http://localhost:5000", changeOrigin: true },
      },
    },
  },
});
