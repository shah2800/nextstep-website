import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Image optimization — modern formats + caching for faster loads
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  // Experimental: faster page loads via fewer client-side re-renders
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },
  // Compress responses + powered-by header off (minor perf + security)
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
