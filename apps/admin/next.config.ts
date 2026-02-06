import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },

  // Edge Runtime(middleware)에서도 env 보이게 강제 주입
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Next 16에서 Turbopack 기본 사용 – 빈 설정으로 에러만 막기
  turbopack: {},
};

export default nextConfig;