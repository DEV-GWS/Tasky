import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",

      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.href.includes("/api/tasks"),

            handler: "NetworkFirst",

            options: {
              cacheName: "tasks-api-cache",

              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 86400,
              },

              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: "Tasky",
        short_name: "Tasks",

        description: "Modern task manager app",

        theme_color: "#0b0f19",

        background_color: "#0b0f19",

        display: "standalone",

        icons: [
          {
            src: "/pwa-192.png",
            sizes: "192x192",
            type: "image/png",
          },

          {
            src: "/pwa-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
