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
    qualities: [70, 75, 80], // quality values used across the site
    // Allow CMS images uploaded to Cloudflare R2 (admin "Upload image")
    remotePatterns: [
      { protocol: "https", hostname: "media.nextstepinternationals.com" },
      { protocol: "https", hostname: "*.r2.dev" },
    ],
  },
  // Experimental: faster page loads via fewer client-side re-renders
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },
  // Compress responses + powered-by header off (minor perf + security)
  compress: true,
  poweredByHeader: false,
  // 301s from the OLD static site's URLs — preserves Google rankings earned
  // by the previous site instead of serving 404s.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/", permanent: true },
      { source: "/contact.html", destination: "/", permanent: true },
      { source: "/programs.html", destination: "/", permanent: true },
      { source: "/apply.html", destination: "/?apply=true", permanent: true },
      { source: "/track.html", destination: "/?track=true", permanent: true },
      { source: "/blog.html", destination: "/blog", permanent: true },
      { source: "/scholarships.html", destination: "/blog/scholarships-for-pakistani-students", permanent: true },
      { source: "/blog-scholarships.html", destination: "/blog/scholarships-for-pakistani-students", permanent: true },
      { source: "/blog-mbbs-georgia.html", destination: "/blog/mbbs-in-georgia-complete-guide", permanent: true },
      { source: "/blog-georgia-life.html", destination: "/blog/student-life-in-georgia", permanent: true },
      { source: "/blog-study-china.html", destination: "/china-mbbs", permanent: true },
      { source: "/blog-study-azerbaijan.html", destination: "/blog/study-in-azerbaijan-guide", permanent: true },
      { source: "/blog-study-kazakhstan.html", destination: "/blog/study-in-kazakhstan-guide", permanent: true },
      { source: "/blog-study-russia.html", destination: "/blog/study-in-russia-guide", permanent: true },
      { source: "/blog-study-turkey.html", destination: "/blog/study-in-turkey-guide", permanent: true },
      { source: "/blog-visa-guide.html", destination: "/blog/student-visa-guide-for-pakistani-students", permanent: true },
      { source: "/blog-study-abroad.html", destination: "/blog/study-abroad-from-pakistan-complete-guide", permanent: true },
      { source: "/blog-consultancy.html", destination: "/blog/how-to-choose-a-study-abroad-consultant", permanent: true },
    ];
  },
};

export default nextConfig;
