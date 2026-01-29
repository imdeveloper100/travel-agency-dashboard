import { IconBell, IconCirclePlusFilled } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import PrimaryButton from "./PrimaryButton"
import { useNavigate } from "react-router-dom"

export function SiteHeader() {
  const navigate = useNavigate()
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Tickets and Booking</h1>
        <div className="ml-auto flex items-center gap-2">
          <PrimaryButton onClick={() => navigate('/create-ticket')}>
            <IconCirclePlusFilled className="size-4" />
            <span className="hidden sm:inline">Create Ticket</span>
          </PrimaryButton>
          <Button
            size="icon"
            variant="outline"
            className="size-8"
          >
            <IconBell className="size-4" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
