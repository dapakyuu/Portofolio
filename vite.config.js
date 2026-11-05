import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" membuat hasil build bisa di-host di root domain
// maupun di sub-folder (mis. GitHub Pages: /Portofolio/).
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    // Pisahkan file hasil build dari folder public/assets milik kita
    assetsDir: "static",
    // model-viewer (3D) memang besar, tapi hanya dimuat saat section Tentang terlihat
    chunkSizeWarningLimit: 1200,
  },
});
