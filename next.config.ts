import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export', // Genera archivos estáticos
  images: {
    unoptimized: true, // Necesario para GitHub Pages
  },
};

export default nextConfig;
