'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SCROLL_HIDE_THRESHOLD = 80;

export function ActivityHeroSection() {
  const [showArrow, setShowArrow] = useState(true);
  const [arrowReady, setArrowReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setArrowReady(true), 800);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const handleScroll = () => setShowArrow(window.scrollY <= SCROLL_HIDE_THRESHOLD);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center bg-white">
      <div className="mx-auto flex flex-1 w-full max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-4xl text-center text-6xl font-black tracking-tight text-gray-900 sm:text-7xl md:text-8xl lg:text-8xl xl:text-9xl"
        >
          Activity
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-600 sm:mt-6 sm:text-xl md:text-2xl"
        >
          세션, 워크샵, MT 등 학회 활동을 만나보세요.
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showArrow && arrowReady ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center"
        style={{ pointerEvents: showArrow && arrowReady ? 'auto' : 'none' }}
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-violet-400"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
