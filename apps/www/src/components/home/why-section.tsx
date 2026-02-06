"use client";

// ============================================================================
// CUSTOMIZATION
// ============================================================================

const COLORS = {
  light: {
    accent: "#FC5200",
    accentHover: "#E54A00",
    activeAccent: "#B8A9E6", // 연보라 (선택된 탭 강조)
    background: "#fafaf9",
    cardBorder: "rgba(231, 229, 228, 0.5)",
    titleText: "#1f2937",
    bodyText: "#6b7280",
    subtitleText: "#78716c",
  },
  dark: {
    accent: "#FC5200",
    accentHover: "#FF6B20",
    activeAccent: "#A78BFA", // 연보라 (선택된 탭 강조)
    background: "#1c1917",
    cardBorder: "rgba(68, 64, 60, 0.5)",
    titleText: "#f5f5f4",
    bodyText: "#a8a29e",
    subtitleText: "#a8a29e",
  },
} as const;

// ============================================================================
// END CUSTOMIZATION
// ============================================================================

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface WhySectionProps {
  mode?: "light" | "dark";
}

const features = [
  {
    id: 1,
    image: "/image/session.JPG",
    title: "Session",
    description:
      "Create stunning designs effortlessly with a user-friendly interface.",
  },
  {
    id: 2,
    image: "/image/project.JPG",
    title: "Project",
    description:
      "Turn ideas into interactive prototypes without writing a single line of code.",
  },
  {
    id: 3,
    image: "/image/networking.png",
    title: "Networking",
    description: "Work seamlessly with your team, get instant feedback.",
  },
];

export function WhySection({ mode = "light" }: WhySectionProps) {
  const colors = COLORS[mode];
  const isDark = mode === "dark";
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section
      className={`relative w-full py-20 ${isDark ? "bg-stone-950" : "bg-white"}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
            style={{ color: colors.titleText }}
          >
            Why HateSlop ?
          </h2>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl"
          style={{ backgroundColor: colors.background }}
        >
          <div
            className="grid rounded-3xl border lg:grid-cols-2"
            style={{ borderColor: colors.cardBorder }}
          >
            {/* Left Column - Feature Tabs */}
            <div
              className="flex flex-col border-r"
              style={{ borderColor: colors.cardBorder }}
            >
              {features.map((feature, index) => (
                <div key={feature.id} className="flex flex-1 flex-col">
                  <button
                    type="button"
                    onClick={() => setActiveTab(index)}
                    className={`flex flex-1 flex-col justify-center border-l-4 px-6 py-8 text-left transition-all duration-200 ${
                      activeTab === index
                        ? isDark
                          ? "bg-stone-900"
                          : "bg-white"
                        : "bg-transparent border-l-transparent"
                    } ${activeTab !== index ? "opacity-70" : "opacity-100"}`}
                    style={
                      activeTab === index
                        ? { borderLeftColor: colors.activeAccent }
                        : undefined
                    }
                  >
                    <h3
                      className="text-lg font-medium"
                      style={{ color: colors.titleText }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: colors.bodyText }}
                    >
                      {feature.description}
                    </p>
                  </button>
                  {index < features.length - 1 && (
                    <div
                      className="relative h-[1px] flex-shrink-0"
                      style={{ backgroundColor: colors.cardBorder }}
                    >
                      {activeTab === index && (
                        <motion.div
                          className="absolute inset-0 h-full origin-left"
                          style={{ backgroundColor: colors.activeAccent }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Column - Selected feature image */}
            <div className="flex items-center justify-center p-6 lg:p-8">
              <div
                className="relative w-full overflow-hidden rounded-xl"
                style={{
                  aspectRatio: "1 / 1",
                  boxShadow:
                    "rgba(0, 0, 0, 0.2) 0px 0.722625px 1.87882px -1.16667px, rgba(0, 0, 0, 0.18) 0px 2.74624px 7.14022px -2.33333px, rgba(0, 0, 0, 0.09) 0px 12px 31.2px -3.5px",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    className="relative h-full w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={features[activeTab].image}
                      alt={features[activeTab].title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
