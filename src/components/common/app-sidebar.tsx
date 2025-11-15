"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Calendar, Home, Inbox, Search, Settings, UserCircle } from "lucide-react"
import Link from "next/link"
import { SwitchTheme } from "../common/switch-theme"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

const AppSidebar = () => {
  const { user } = useAuth()

  return (
    <Sidebar>
      <SidebarContent>
        {user && (
          <div className="flex flex-col items-center p-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.user_metadata.avatar_url} />
              <AvatarFallback>{user.user_metadata.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <p className="mt-2 text-lg font-semibold">{user.user_metadata.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        )}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/user"
                      className="flex items-center gap-2"
                    >
                      <UserCircle />
                      <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex items-center gap-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem className="p-2">
                <SwitchTheme />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export { AppSidebar }