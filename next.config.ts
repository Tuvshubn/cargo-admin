import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  experimental: { optimizePackageImports: ['@mui/material', '@mui/icons-material'] },
};
export default nextConfig;
