// app/student/layout.tsx
"use client";

import { useState } from "react"
import { SidebarNav } from "@/app/components/sidebar-nav"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

const studentNavItems = [
  {
    title: "Dashboard",
    href: "/student",
    icon: "dashboard",
  },
]

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-2 left-2 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <div className={`
        fixed inset-0 z-40 lg:relative w-64
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-200 ease-in-out
      `}>
        <SidebarNav items={studentNavItems} />
      </div>

      {/* Main content */}
      <main className="flex-1 lg:pl-64">
        <div className="lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}