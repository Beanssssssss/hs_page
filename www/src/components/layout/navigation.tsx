'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="flex items-center justify-center h-20 px-6">
        <div className="flex items-center justify-between gap-5 w-full max-w-[1200px]">
          {/* Logo - 왼쪽으로 이동 */}
          <Link href="/" className="flex items-center w-[116px] h-10 -ml-6">
            <Image
              src="/image/logo_black.svg"
              alt="HateSlop Logo"
              width={116}
              height={40}
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Nav Links - 간격 확대 */}
          <div className="flex items-center gap-[85px] flex-1 justify-center">
            <Link href="/" className="hover:opacity-70 transition-opacity">
              <Text variant="medium" as="span" className="text-[#606266] font-normal">
                Home
              </Text>
            </Link>
            <Link href="/recruit" className="hover:opacity-70 transition-opacity">
              <Text variant="medium" as="span" className="text-[#606266] font-normal">
                Recruit
              </Text>
            </Link>
            <Link href="/projects" className="hover:opacity-70 transition-opacity">
              <Text variant="medium" as="span" className="text-[#606266] font-normal">
                Project
              </Text>
            </Link>
            <Link href="/activities" className="hover:opacity-70 transition-opacity">
              <Text variant="medium" as="span" className="text-[#606266] font-normal">
                Activity
              </Text>
            </Link>
          </div>

          {/* CTA Button - 오른쪽으로 이동 */}
          <Button 
            variant="dark" 
            size="darkSmall"
            className="-mr-6"
            style={{
              background: 'linear-gradient(180deg, #101011 0%, rgb(43, 43, 44) 100%)'
            }}
          >
            4기 신청하기
          </Button>
        </div>
      </div>
    </nav>
  );
}

