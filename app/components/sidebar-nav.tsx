// app/components/sidebar-nav.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/app/components/theme-toggle"
import {
  GalleryHorizontalEnd,
  Plus,
  type LucideIcon,
} from "lucide-react"

const Icons: Record<string, LucideIcon> = {
  gallery: GalleryHorizontalEnd,
  plus: Plus,
}

interface NavItem {
  href: string;
  icon: keyof typeof Icons;
  title: string;
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: NavItem[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Pottery Studio</h2>
        <p className="text-sm text-muted-foreground">Student Portal</p>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {studentRoutes.map((route) => {
            const Icon = Icons[route.icon]
            return (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === route.href && "bg-secondary"
                )}
                asChild
              >
                <Link href={route.href}>
                  <Icon className="h-4 w-4" />
                  {route.title}
                </Link>
              </Button>
            )
          })}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <ThemeToggle />
      </div>
    </div>
  )
}

const studentRoutes: NavItem[] = [
  {
    href: "/student",
    icon: "gallery",
    title: "My Pieces",
  },
  {
    href: "/student/new",
    icon: "plus",
    title: "New Piece",
  },
]