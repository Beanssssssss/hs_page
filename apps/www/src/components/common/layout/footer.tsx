'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Github, Youtube, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer
      className="bg-black text-white overflow-hidden"
      style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 min-[480px]:px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:gap-8 pt-8 sm:pt-10 md:pt-[46px] pb-8 sm:pb-10 md:pb-[40px]">
          <div className="w-full flex flex-col md:flex-row justify-start items-center md:items-start gap-8 md:gap-[80px]">
            <div className="flex-1 w-full max-w-[280px] md:max-w-none min-h-0 md:h-[337px] flex flex-col justify-between items-center md:items-start gap-6 md:gap-0 text-center md:text-left">
              <div className="w-full max-w-[200px] sm:max-w-[240px] md:w-[269px] h-16 sm:h-20 md:h-[103px] flex items-center justify-center md:justify-start md:-ml-9">
                <Image
                  src="/image/logo_purple_genAI.svg"
                  alt="HateSlop Generative AI Logo"
                  width={269}
                  height={103}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col justify-start items-center md:items-start gap-6 sm:gap-8 pb-4 md:pb-8">
                <div className="flex flex-col gap-2">
                  <p className="text-gray-400 text-sm">Email</p>
                  <a
                    href="mailto:hateslop.academy@gmail.com"
                    className="text-white hover:text-purple-400 transition-colors text-sm sm:text-base break-all"
                  >
                    hateslop.academy@gmail.com
                  </a>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-gray-400 text-sm">Follow us on:</p>
                  <div className="flex flex-row items-center gap-0">
                    <Link
                      href="https://www.instagram.com/hateslop/"
                      className="text-white hover:text-purple-400 transition-colors p-2 first:pl-0"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Link>
                    <div className="w-px h-5 sm:h-6 bg-gray-700" />
                    <Link
                      href="https://github.com/HateSlop"
                      className="text-white hover:text-purple-400 transition-colors p-2"
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Link>
                    <div className="w-px h-5 sm:h-6 bg-gray-700" />
                    <Link
                      href="https://www.youtube.com/@hateslop"
                      className="text-white hover:text-purple-400 transition-colors p-2"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Link>
                    <div className="w-px h-5 sm:h-6 bg-gray-700" />
                    <Link
                      href="https://www.linkedin.com/company/hateslop/"
                      className="text-white hover:text-purple-400 transition-colors p-2"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gray-800" />

          <div className="w-full text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © Copyright 2026 HATESLOP. All Right Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
