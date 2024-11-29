"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  GalleryHorizontal, 
  UserCircle,
  Settings,
  LogOut
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/student",
    pattern: /^\/student(?:\/(?:$|[^/]))?/,
  },
  {
    label: "My Pieces",
    icon: GalleryHorizontal,
    href: "/student/pieces",
    pattern: /^\/student\/pieces/,
  },
  {
    label: "Profile",
    icon: UserCircle,
    href: "/student/profile",
    pattern: /^\/student\/profile/,
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/student/settings",
    pattern: /^\/student\/settings/,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {routes.map((route) => (
        <Button
          key={route.href}
          variant={route.pattern.test(pathname) ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-2",
            route.pattern.test(pathname) && "bg-secondary"
          )}
          asChild
        >
          <Link href={route.href}>
            <route.icon className="h-4 w-4" />
            {route.label}
          </Link>
        </Button>
      ))}
      <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </nav>
  );
}