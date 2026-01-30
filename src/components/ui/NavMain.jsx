import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "./Sidebar"
import { cn } from "@/lib/utils"

export function NavMain({ items }) {
  const location = useLocation()
  const isActive = (item) => item.url && location.pathname === item.url


  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) =>
            item.items ? (
              <NavMainCollapsible
                key={item.title}
                item={item}
                location={location}
              />
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  "hover:bg-primary/10 hover:text-primary"
                )} isActive={isActive(item)}>
                  <Link to={item.url || "#"}>
                    {item.icon && (
                      <item.icon className={cn("h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors", isActive(item) && "text-primary")} />
                    )}

                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function NavMainCollapsible({ item, location }) {
  const [open, setOpen] = React.useState(() => {
    const path = location.pathname
    const search = location.search || ""
    return item.items?.some((sub) => {
      const to = sub.url || "#"
      if (to.startsWith("/") && to.includes("?")) {
        const [p, q] = to.split("?")
        return path === p && (q ? search.includes(q.split("=")[1]) : true)
      }
      return path === to || (path + search) === to
    })
  })

  const isSubActive = (url) => {
    if (!url) return false
    const current = location.pathname + location.search
    if (url.includes("?")) return current === url || location.pathname === url.split("?")[0]
    return location.pathname === url
  }

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        tooltip={item.title}
        className="cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        {item.icon && <item.icon />}
        <span>{item.title}</span>
        <ChevronDown
          className={cn("ml-auto h-4 w-4 shrink-0 transition-transform", open && "rotate-180")}
        />
      </SidebarMenuButton>
      {open && item.items?.length > 0 && (
        <SidebarMenuSub className="ml-4 border-l pl-3">
          {item.items.map((sub) => (
            <SidebarMenuSubItem key={sub.title}>
              <SidebarMenuSubButton
                asChild
                isActive={isSubActive(sub.url)}
                className={cn(
                  "rounded-md px-2 py-1.5 text-sm transition",
                  "hover:bg-primary/10",
                  isSubActive(sub.url) && "bg-primary/15 text-primary"
                )}
              >
                <Link to={sub.url || "#"}>
                  <span>{sub.title}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>

      )}
    </SidebarMenuItem>
  )
}
