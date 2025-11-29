"use client";

import { usePathname } from "next/navigation";
import { AdminNav } from "./nav";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // 1. 로그인 페이지: 사이드바 없이 중앙 정렬된 컨텐츠만 보여줌
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 2. 관리자 페이지: 사이드바(Fixed) + 메인 컨텐츠(Left Padding)
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* 사이드바 (고정) */}
      <AdminNav />

      {/* 메인 컨텐츠 (사이드바 너비 64(16rem)만큼 왼쪽 여백 확보) */}
      <main className="pl-64 transition-all duration-300 ease-in-out">
        <div className="container max-w-7xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
