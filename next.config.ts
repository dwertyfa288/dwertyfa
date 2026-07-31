import type { NextConfig } from "next";

const basePath = process.env.BASE_PATH ?? "";
const isStaticExport = Boolean(process.env.GITHUB_ACTIONS || basePath);

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
};

export default nextConfig;
