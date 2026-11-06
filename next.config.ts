import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev "N" badge — it covers the profile avatar in the bottom-left.
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
