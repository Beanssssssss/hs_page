'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/recruit', label: 'Recruit' },
  { href: '/projects', label: 'Project' },
  { href: '/activities', label: 'Activity' },
];

const ctaUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSeM1Yc7aXJuBbB6ju6G88sQUaa0Z1FWRtCjgTnVYLS8eUmprQ/viewform?usp=dialog';

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="flex items-center justify-between h-14 min-[480px]:h-16 sm:h-16 md:h-[72px] lg:h-20 px-3 min-[480px]:px-4 sm:px-5 md:px-6 max-w-[1200px] mx-auto">
        <Link
          href="/"
          className="flex items-center shrink-0 w-16 h-7 min-[480px]:w-20 min-[480px]:h-8 sm:w-[100px] sm:h-9 md:w-[116px] md:h-10"
          aria-label="HateSlop 홈"
        >
          <Image
            src="/image/logo_black.svg"
            alt="HateSlop Logo"
            width={116}
            height={40}
            className="w-full h-full object-contain object-left"
          />
        </Link>

        {/* Desktop: Nav Links + CTA (md 이상에서 링크, lg 이상에서 CTA 버튼) */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-[85px] flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm lg:text-base text-[#606266] font-medium hover:text-black hover:opacity-80 transition-opacity py-2"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center shrink-0">
          <Button
            asChild
            variant="dark"
            size="darkSmall"
            className="text-sm lg:text-base px-4 py-2 lg:px-5 lg:py-2.5"
            style={{
              background:
                'linear-gradient(180deg, #101011 0%, rgb(43, 43, 44) 100%)',
            }}
          >
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
              4기 신청하기
            </a>
          </Button>
        </div>

        {/* Mobile/Tablet: Hamburger (md 미만) */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] -mr-1 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
              aria-label="메뉴 열기"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[min(320px,85vw)] max-w-[320px] overflow-y-auto"
            style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}
          >
            <SheetHeader>
              <SheetTitle className="sr-only">메뉴</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 pt-6 pb-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-gray-800 hover:text-black hover:bg-gray-50 active:bg-gray-100 transition-colors py-3 px-3 rounded-lg min-h-[44px] flex items-center"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-gray-200">
                <Button
                  asChild
                  variant="dark"
                  size="darkSmall"
                  className="w-full min-h-[44px] text-base"
                  style={{
                    background:
                      'linear-gradient(180deg, #101011 0%, rgb(43, 43, 44) 100%)',
                  }}
                >
                  <a
                    href={ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                  >
                    4기 신청하기
                  </a>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
