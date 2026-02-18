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
    const backend =
      "http://35.154.103.140/docs";
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
