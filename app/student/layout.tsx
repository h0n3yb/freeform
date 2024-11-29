// app/student/layout.tsx
import { SidebarNav } from "@/app/components/sidebar-nav"

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
  return (
    <div className="flex min-h-screen">
      <SidebarNav items={studentNavItems} />
      <div className="flex-1">
        <div className="container p-6">
          {children}
        </div>
      </div>
    </div>
  )
}