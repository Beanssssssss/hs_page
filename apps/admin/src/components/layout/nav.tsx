"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderKanban, FileText, Users, LogOut, MessageSquare, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";

const items = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/posts/projects", label: "프로젝트", icon: FolderKanban },
  { href: "/posts/activities", label: "액티비티", icon: Calendar },
  { href: "/posts/introduce", label: "소개", icon: FileText },
  { href: "/posts/recruit", label: "리크루팅", icon: Users },
  { href: "/posts/chatbot", label: "챗봇", icon: MessageSquare },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  return (
    <nav className="w-64 min-h-screen border-r bg-card p-4 flex flex-col fixed left-0 top-0 h-full z-50">
      <div className="mb-8 px-4 pt-2">
        <h1 className="font-bold text-xl tracking-tight">관리자</h1>
      </div>

      <div className="flex-1 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto border-t pt-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </Button>
      </div>
    </nav>
  );
}
