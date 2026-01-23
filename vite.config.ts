import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Serve data/ directory in development
    {
      name: "serve-data-folder",
      configureServer(server) {
        server.middlewares.use("/data", (req, res, next) => {
          const filePath = path.join(__dirname, "data", req.url || "");
          if (fs.existsSync(filePath)) {
            res.setHeader("Content-Type", "application/json");
            res.end(fs.readFileSync(filePath));
          } else {
            next();
          }
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
