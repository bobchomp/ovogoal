import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "a.espncdn.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "matthewresnick.wordpress.com" },
      { protocol: "https", hostname: "logopond.com" },
    ],
  },
};

export default nextConfig;
