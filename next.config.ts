import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site — no server, no API routes. Builds to ./out and
  // deploys to Cloudflare Pages. The interest form posts directly to an
  // external Google Form from the browser.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
