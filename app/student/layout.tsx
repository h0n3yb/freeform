// app/student/layout.tsx
"use client";

import { useState } from "react"
import { SidebarNav } from "@/app/components/sidebar-nav"
import { Menu, X, GalleryHorizontalEnd, Plus, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/app/components/theme-toggle"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Icons: Record<string, LucideIcon> = {
 gallery: GalleryHorizontalEnd,
 plus: Plus,
}

interface NavItem {
 href: string;
 icon: keyof typeof Icons;
 title: string;
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

export default function StudentLayout({
 children,
}: {
 children: React.ReactNode
}) {
 const [isSidebarOpen, setIsSidebarOpen] = useState(false)
 const pathname = usePathname()

 return (
   <div className="flex min-h-screen">
     <Button
       variant="ghost"
       size="sm"
       className="md:hidden fixed top-3 right-3 z-50"
       onClick={() => setIsSidebarOpen(!isSidebarOpen)}
     >
       {isSidebarOpen ? (
         <X className="h-5 w-5" />
       ) : (
         <Menu className="h-5 w-5" />
       )}
     </Button>

     {isSidebarOpen && (
       <div 
         className="fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden z-30"
         onClick={() => setIsSidebarOpen(false)}
       />
     )}

     <div className={`
       md:hidden fixed inset-y-0 right-0 z-40 w-64 bg-background
       ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
       transition-transform duration-200 ease-in-out
     `}>
       <div className="h-full flex flex-col">
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
                   className="w-full justify-start gap-2"
                   asChild
                   onClick={() => setIsSidebarOpen(false)}
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
     </div>

     <SidebarNav />

     <div className="flex-1">
       <div className="p-4 md:p-6 md:pl-64">
         {children}
       </div>
     </div>
   </div>
 )
}