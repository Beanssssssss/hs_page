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
      <div className="relative flex items-center justify-between h-14 min-[480px]:h-16 sm:h-16 md:h-[72px] lg:h-20 w-full pl-3 pr-3 min-[480px]:pl-4 min-[480px]:pr-4 sm:pl-5 sm:pr-5 md:pl-6 md:pr-6">
        <Link
          href="/"
          className="flex items-center shrink-0 h-full min-w-[100px] w-32 min-[480px]:w-40 sm:w-48 md:w-56 lg:w-64"
          aria-label="HateSlop 홈"
        >
          <Image
            src="/image/logo_purple_genAI.svg"
            alt="HateSlop Logo"
            width={256}
            height={80}
            className="w-full h-full object-contain object-left"
          />
        </Link>

        {/* Desktop: Nav Links - 화면 정중앙 고정 */}
        <div className="hidden md:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 items-center gap-6 lg:gap-8 xl:gap-[85px]">
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
