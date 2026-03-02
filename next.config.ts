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
  basePath: '/travel-album-frontend',
  assetPrefix: '/travel-album-frontend/',
  // Importante: para desarrollo local
  ...(process.env.NODE_ENV === 'development' && {
    basePath: '',
    assetPrefix: '',
  }),
};

export default nextConfig;
