// app/student/components/mobile-nav.tsx
"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarNav } from "@/app/components/sidebar-nav"

interface MobileNavProps {
  items: {
    title: string;
    href: string;
    icon: string;
  }[];
}

export function MobileNav({ items }: MobileNavProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div className={`
        fixed inset-0 z-40 lg:relative
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-200 ease-in-out
      `}>
        <SidebarNav items={items} />
      </div>
    </>
  )
}