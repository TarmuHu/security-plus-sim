import type { NextConfig } from "next";

/** Set GITHUB_PAGES=true in CI so asset URLs work under /security-plus-sim/ */
const isGhPages = process.env.GITHUB_PAGES === "true";
const repo = "security-plus-sim";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isGhPages
    ? {
        basePath: `/${repo}`,
        assetPrefix: `/${repo}/`,
      }
    : {}),
};

export default nextConfig;
