import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export to `out/` - the whole app is client rendered.
  output: "export",
};

export default nextConfig;
