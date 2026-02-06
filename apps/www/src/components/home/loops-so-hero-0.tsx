"use client";

// ============================================================================
// CUSTOMIZATION - 이 섹션의 값들을 수정하여 프로젝트에 맞게 조정하세요
// ============================================================================

/**
 * 커스텀 색상 (브랜드 컬러)
 */
const COLORS = {
  light: {
    accent: "#FF6B35", // Loops orange
    accentHover: "#E55A2B",
  },
  dark: {
    accent: "#FF6B35",
    accentHover: "#FF8555",
  },
} as const;


// ============================================================================
// END CUSTOMIZATION
// ============================================================================

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const PARTNERS = [
  { id: 1, name: "Partner 1", logo: "/image/logo_partner_1.svg" },
  { id: 2, name: "Partner 2", logo: "/image/logo_partner_2.png" },
  { id: 3, name: "Partner 3", logo: "/image/logo_partner_3.png" },
  { id: 4, name: "Partner 4", logo: "/image/logo_partner_4.png" },
];

interface LoopsSoHero0Props {
  mode?: "light" | "dark";
}

export default function LoopsSoHero0({ mode = "light" }: LoopsSoHero0Props) {
  const colors = COLORS[mode];
  const isDark = mode === "dark";

  return (
    <section
      className={`relative w-full min-h-screen flex flex-col justify-center ${isDark ? "bg-gray-950" : "bg-white"}`}
    >
      {/* Hero Content - 뷰포트 가득 채우기 */}
      <div className="mx-auto flex flex-1 w-full max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`mx-auto max-w-4xl text-center text-6xl font-black tracking-tight sm:text-7xl md:text-8xl lg:text-8xl xl:text-9xl ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          HATESLOP
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mx-auto mt-4 sm:mt-6 max-w-2xl text-center text-lg sm:text-xl md:text-2xl ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Media & Tech Academy Group With Generative AI
          <br />
          서강대학교 생성형 AI 미디어 & 테크 학회
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col items-center gap-4 sm:mt-10"
        >
        </motion.div>

        {/* Partner logos marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 relative overflow-hidden sm:mt-20 lg:mt-24"
        >
          <div
            className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24"
            style={{
              background: isDark
                ? "linear-gradient(to right, rgb(3, 7, 18) 0%, transparent 100%)"
                : "linear-gradient(to right, white 0%, transparent 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24"
            style={{
              background: isDark
                ? "linear-gradient(to left, rgb(3, 7, 18) 0%, transparent 100%)"
                : "linear-gradient(to left, white 0%, transparent 100%)",
            }}
          />

          <div className="flex overflow-hidden py-4">
            <div className="flex animate-marquee-left items-center gap-16 shrink-0">
              {[...PARTNERS, ...PARTNERS].map((partner, i) => (
                <div
                  key={`partner-${partner.id}-${i}`}
                  className="relative shrink-0 w-28 h-12 sm:w-36 sm:h-14 md:w-[150px] md:h-[80px] grayscale opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={150}
                    height={80}
                    className="object-contain w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
