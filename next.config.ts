import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site — no server, no API routes. Builds to ./out and
  // deploys to Cloudflare Pages. The interest form posts directly to an
  // external Google Form from the browser.
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    // pnpm-lock.yaml in home dir causes Turbopack to pick the wrong workspace root
    root: __dirname,
  },
};

export default nextConfig;
