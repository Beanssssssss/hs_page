'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Github, Youtube, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Footer Container: 1200px, Stack Vertical, Center, Gap 10, Padding 46 0 40 0 */}
      <div className="w-full max-w-[1200px] mx-auto px-0">
        <div className="flex flex-col items-center gap-[10px] pt-[46px] pb-[40px]">
          
          {/* Footer Grid: Stack Horizontal, Start, Top, Gap 80 */}
          <div className="w-full flex flex-row justify-start items-start gap-[80px]">
            
            {/* Footer About: 1fr, Height 337px, Stack Vertical, Space Between, Left */}
            <div className="flex-1 h-[337px] flex flex-col justify-between items-start">
              
              {/* Footer Logo: 269×103px, Stack Horizontal, Start, Gap 10 */}
              <div className="w-[269px] h-[103px] flex flex-row items-center justify-start gap-[10px] -ml-9">
                <Image
                  src="/image/logo_purple_genAI.svg"
                  alt="HateSlop Generative AI Logo"
                  width={269}
                  height={103}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Footer Social */}
              <div className="flex flex-col justify-start items-start gap-8 pb-8">
                {/* Email Section */}
                <div className="flex flex-col gap-2">
                  <p className="text-gray-400 text-sm">Email</p>
                  <a 
                    href="mailto:hateslop.academy@gmail.com" 
                    className="text-white hover:text-purple-400 transition-colors text-base"
                  >
                    hateslop.academy@gmail.com
                  </a>
                </div>
                
                {/* Social Section */}
                <div className="flex flex-col gap-4">
                  <p className="text-gray-400 text-sm">Follow us on:</p>
                  
                  {/* Social Icons Stack - Horizontal */}
                  <div className="flex flex-row items-center gap-0">
                    <Link
                      href="https://www.instagram.com/hateslop/"
                      className="text-white hover:text-purple-400 transition-colors px-2 first:pl-0"
                    >
                      <Instagram className="w-6 h-6" />
                    </Link>
                    <div className="w-px h-6 bg-gray-700" />
                    
                    <Link
                      href="https://github.com/HateSlop"
                      className="text-white hover:text-purple-400 transition-colors px-2"
                    >
                      <Github className="w-6 h-6" />
                    </Link>
                    <div className="w-px h-6 bg-gray-700" />
                    
                    <Link
                      href="https://www.youtube.com/@hateslop"
                      className="text-white hover:text-purple-400 transition-colors px-2"
                    >
                      <Youtube className="w-6 h-6" />
                    </Link>
                    <div className="w-px h-6 bg-gray-700" />
                    
                    <Link
                      href="https://www.linkedin.com/company/hateslop/"
                      className="text-white hover:text-purple-400 transition-colors px-2"
                    >
                      <Linkedin className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gray-800" />

          {/* Copyright */}
          <div className="w-full text-center">
            <p className="text-gray-400 text-sm">
            © Copyright 2026 HATESLOP. All Right Reserved
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}

