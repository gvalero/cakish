import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const isV2 = process.env.NEXT_PUBLIC_SITE_VERSION === "v2";
const repoName = "cakish";

const basePath = isGitHubPages
  ? isV2
    ? `/${repoName}/v2`
    : `/${repoName}`
  : "";

const assetPrefix = isGitHubPages
  ? isV2
    ? `/${repoName}/v2/`
    : `/${repoName}/`
  : "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath,
  assetPrefix,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
