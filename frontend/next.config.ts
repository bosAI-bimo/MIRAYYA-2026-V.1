import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  turbopack: {},
  // @ts-expect-error - Bypassing Next.js 16 strict type check for eslint property
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withPWA(nextConfig);
