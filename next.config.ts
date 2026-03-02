import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true'; // Nueva variable
const repoName = 'travel-album-frontend';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // basePath solo para GitHub Pages
  basePath: isProd && isGitHubPages ? `/${repoName}` : '',
  assetPrefix: isProd && isGitHubPages ? `/${repoName}/` : '',
  
  trailingSlash: true,
  
  // Importante para rutas relativas
  experimental: {
    // Esto ayuda con las rutas de los assets
    optimizeCss: false,
  },
};

export default nextConfig;
