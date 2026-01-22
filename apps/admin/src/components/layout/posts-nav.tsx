"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/posts/projects", label: "프로젝트" },
  { href: "/posts/introduce", label: "소개" },
  { href: "/posts/recruit", label: "리크루팅" },
];

export function PostsNav() {
  const pathname = usePathname();

  return (
    <div className="border-b mb-6">
      <nav className="flex gap-6">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "pb-3 text-sm font-medium transition",
                active
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}