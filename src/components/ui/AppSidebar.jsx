import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconLogin,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./Sidebar"
import { Ticket, ClipboardList } from "lucide-react"
import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Book Tickets",
      url: "/tickets",
      icon: Ticket,
    },
    {
      title: "Bookings",
      icon: ClipboardList,
      items: [
        { title: "All Bookings", url: "/booking-requests" },
        { title: "All Pending", url: "/booking-requests?status=pending" },
        { title: "On Hold", url: "/booking-requests?status=on-hold" },
        { title: "Approved", url: "/booking-requests?status=approved" },
        { title: "Rejected", url: "/booking-requests?status=rejected" },
      ],
    },
    {
      title: "Login",
      url: "/login",
      icon: IconLogin,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b bg-muted/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="!p-3 hover:bg-transparent"
            >
              <a href="/" className="flex items-center gap-3">
                <IconInnerShadowTop className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold tracking-tight text-primary">
                  Al Saqib Travels
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
