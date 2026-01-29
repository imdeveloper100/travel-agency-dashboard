import { Outlet } from 'react-router-dom'
import {
  SidebarInset,
  SidebarProvider,
} from "./ui/Sidebar"
import { AppSidebar } from "./ui/AppSidebar"
import { SiteHeader } from "./ui/SiteHeader"

/**
 * Layout Component
 * 
 * This component provides the common layout structure (Sidebar + Header)
 * for all pages. Individual page content is rendered via <Outlet />
 */
export default function Layout() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
