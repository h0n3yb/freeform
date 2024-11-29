// app/instructor/layout.tsx
import { LayoutDashboard, Box, MapPin } from "lucide-react"
import { SidebarNav } from "@/app/components/sidebar-nav"

const instructorNavItems = [
  {
    title: "Dashboard",
    href: "/instructor",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Pieces",
    href: "/instructor/pieces",
    icon: <Box className="h-4 w-4" />,
  },
  {
    title: "Locations",
    href: "/instructor/locations",
    icon: <MapPin className="h-4 w-4" />,
  },
]

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <SidebarNav items={instructorNavItems} />
      <div className="flex-1">
        <div className="container p-6">
          {children}
        </div>
      </div>
    </div>
  )
}