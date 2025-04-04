'use client'

import { Atom, Sparkles, BookOpen, LayoutDashboard, Network } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/app/(frontend)/ui/sidebar'
import { cn } from '@/app/(frontend)/lib/utils'

type NavItem = {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const dashboardItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Concept Graph',
    href: '/graph',
    icon: Network,
  },
]

const collectionItems: NavItem[] = [
  {
    title: 'Atoms',
    href: '/atoms',
    icon: Atom,
  },
  {
    title: 'Synthesized Atoms',
    href: '/synthesized',
    icon: Sparkles,
  },
  {
    title: 'Sources',
    href: '/sources',
    icon: BookOpen,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold px-4 py-3">
          <Network className="h-5 w-5" />
          <span>Atomizer</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild data-active={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Collections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {collectionItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild data-active={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="px-4 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>Atomizer</span>
            <span>•</span>
            <span>v1.0.0</span>
          </div>
          <div className="mt-1">Concept Vector Explorer</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
