import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },

  // 🔥 핵심: Edge Runtime(middleware)에서도 env 보이게 강제 주입
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  webpack(config) {
    config.resolve.alias["@"] = path.join(__dirname, "src");
    return config;
  },
};

export default nextConfig;