import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keeps the dev badge out of reference screenshots.
  devIndicators: false,
  // The prop route reads its scans from disk, which the tracer cannot see.
  outputFileTracingIncludes: {
    "/api/prop/*": ["./props/**/*"],
  },
};

export default nextConfig;
