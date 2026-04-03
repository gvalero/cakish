import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: "",
    NEXT_PUBLIC_STRIPE_WORKER_URL: "https://cakish-stripe-checkout.valerogian.workers.dev",
  },
};

export default nextConfig;
