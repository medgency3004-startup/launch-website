import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.apollopharmacy.in",
      },
      {
        protocol: "https",
        hostname: "www.truemeds.in",
      },
    ],
  },
  async rewrites() {
    const backend = process.env.BACKEND_URL ?? "http://3.109.214.112:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
