"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "w-64 h-screen border-r bg-background p-4",
      "!hidden md:!block", // More forceful hiding on mobile
      className
    )}>
      <nav className="space-y-2">
        <Button
          variant={pathname === "/student" ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href="/student">Dashboard</Link>
        </Button>
        <Button
          variant={pathname === "/student/pieces/new" ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href="/student/pieces/new">New Piece</Link>
        </Button>
      </nav>
    </aside>
  );
} 