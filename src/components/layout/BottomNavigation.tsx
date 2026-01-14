/**
 * BottomNavigation Component
 * iOS-style bottom navigation bar
 */

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Panel", icon: "dashboard", href: "/" },
  { label: "Konular", icon: "library_books", href: "/subjects" },
  { label: "Takvim", icon: "calendar_month", href: "/calendar" },
  { label: "Profil", icon: "person", href: "/profile" },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-20 w-full border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-md items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-text-sub hover:text-primary dark:text-gray-400 dark:hover:text-white"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={cn(
                  "material-symbols-outlined",
                  isActive && "filled"
                )}
                style={{ fontSize: 24 }}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* iOS Home Indicator Safe Area */}
      <div className="h-5 w-full bg-transparent" />
    </nav>
  );
}
