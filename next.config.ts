import type { NextConfig } from "next";

// When deployed to GitHub Pages the site lives under /cakish.
// Cloudflare Pages and local dev serve from the root — no basePath needed.
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isGitHubPages ? "/cakish" : "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath,
  assetPrefix: isGitHubPages ? "/cakish/" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STRIPE_WORKER_URL: "https://cakish-stripe-checkout.valerogian.workers.dev",
  },
};

export default nextConfig;
