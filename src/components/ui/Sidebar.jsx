import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { IconMenu2 } from "@tabler/icons-react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContext = React.createContext({
  state: "expanded",
  open: true,
  setOpen: () => { },
  isMobile: false,
  toggleSidebar: () => { },
})

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

const SidebarProvider = React.forwardRef(
  ({ defaultOpen = true, open: openProp, onOpenChange, className, style, children, ...props }, ref) => {
    const [openMobile, setOpenMobile] = React.useState(false)
    const [openDesktop, setOpenDesktop] = React.useState(() => {
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';')
        const sidebarCookie = cookies.find(c => c.trim().startsWith(`${SIDEBAR_COOKIE_NAME}=`))
        if (sidebarCookie) {
          return sidebarCookie.split('=')[1] === 'true'
        }
      }
      return defaultOpen
    })
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }
      checkMobile()
      window.addEventListener("resize", checkMobile)
      return () => window.removeEventListener("resize", checkMobile)
    }, [])

    const open = openProp ?? (isMobile ? openMobile : openDesktop)
    const setOpen = React.useCallback(
      (value) => {
        const openState = typeof value === "function" ? value(open) : value
        if (onOpenChange) {
          onOpenChange(openState)
        }
        if (!isMobile) {
          setOpenDesktop(openState)
          document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState};path=/;max-age=${SIDEBAR_COOKIE_MAX_AGE}`
        } else {
          setOpenMobile(openState)
        }
      },
      [isMobile, onOpenChange, open]
    )

    const toggleSidebar = React.useCallback(() => {
      return setOpen((open) => !open)
    }, [setOpen])

    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo(
      () => ({
        state,
        open: isMobile ? openMobile : open,
        setOpen,
        isMobile,
        toggleSidebar,
      }),
      [state, isMobile, open, openMobile, setOpen, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider>
          <SidebarContext.Provider value={contextValue}>
            <div
              style={
                {
                  "--sidebar-width": SIDEBAR_WIDTH,
                  "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                  ...style,
                }
              }
              className={cn(
                "group/sidebar-wrapper flex h-svh w-full overflow-hidden has-data-[variant=inset]:bg-sidebar",
                className
              )}
              ref={ref}
              {...props}
            >
              {children}
            </div>
          </SidebarContext.Provider>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef(
  ({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
    const { isMobile, state, open, setOpen } = useSidebar()

    if (collapsible === "icon") {
      return (
        <aside
          ref={ref}
          data-state={state}
          data-collapsible={collapsible}
          data-variant={variant}
          data-side={side}
          className={cn("group/sidebar flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-linear overflow-hidden", state === "collapsed" && "w-[--sidebar-width-icon] group-data-[collapsible=icon]:w-[--sidebar-width-icon]", className)}
          {...props}
        >
          {children}
        </aside>
      )
    }

    if (isMobile || collapsible === "offcanvas") {
      return (
        <>
          {!open && isMobile && (
            <div
              className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-200"
              onClick={() => setOpen(true)}
            />
          )}
          <aside
            ref={ref}
            data-state={open ? "open" : "closed"}
            data-collapsible={collapsible}
            data-variant={variant}
            data-side={side}
            className={cn(
              "group/sidebar peer transition-all duration-300 ease-in-out overflow-hidden",
              !isMobile && collapsible === "offcanvas" && [
                "md:relative md:h-full md:flex md:flex-col",
                open ? "md:w-[--sidebar-width] md:border-r" : "md:w-0 md:border-r-0"
              ],
              isMobile && [
                "fixed inset-y-0 z-50 h-svh w-[--sidebar-width] border-r bg-sidebar",
                side === "right" && "right-0",
                open ? "translate-x-0" : (side === "left" ? "-translate-x-full" : "translate-x-full")
              ],
              className
            )}
            {...props}
          >
            <div className={cn(
              "h-full flex flex-col transition-opacity duration-300",
              !isMobile && !open && "md:opacity-0 md:pointer-events-none"
            )}>
              {children}
            </div>
          </aside>
        </>
      )
    }

    return (
      <aside
        ref={ref}
        data-state={state}
        data-collapsible={collapsible}
        data-variant={variant}
        data-side={side}
        className={cn(
          "group/sidebar peer hidden md:flex md:h-full md:w-[--sidebar-width] md:flex-col md:border-r md:bg-sidebar md:transition-[width] md:duration-200 md:ease-linear md:overflow-hidden",
          state === "collapsed" && "md:w-[--sidebar-width-icon]",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <IconMenu2 />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="rail"
      className={cn(
        "absolute inset-y-0 z-50 hidden w-4 -translate-x-full transition-transform group-data-[side=left]:-left-4 group-data-[side=right]:-right-4 group-hover/sidebar:translate-x-0 data-[side=left]:-left-4 data-[side=right]:-right-4 md:flex",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef(({ className, ...props }, ref) => {
  const { isMobile } = useSidebar()
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex h-full flex-1 flex-col overflow-y-auto bg-background transition-all duration-300 ease-in-out",
        "peer-data-[variant=inset]:min-w-0",
        "peer-data-[collapsible=icon]:md:peer-data-[state=collapsed]:md:ml-[--sidebar-width-icon]",
        !isMobile && "md:transition-[margin]",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border px-4", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex h-16 shrink-0 items-center gap-2 border-t border-sidebar-border px-4", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden px-4 py-2 group-data-[collapsible=icon]:overflow-hidden", className)}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1.5 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group-content"
      className={cn("w-full text-sidebar-foreground", className)}
      {...props}
    />
  )
})
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[collapsible=icon]/sidebar-wrapper:!size-8 group-has-data-[collapsible=icon]/sidebar-wrapper:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-sidebar-accent/50 text-sidebar-foreground ring-1 ring-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-has-data-[collapsible=icon]/sidebar-wrapper:!size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef(
  ({ asChild = false, isActive = false, variant = "default", size = "default", className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"

    return (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), isActive && "bg-sidebar-accent text-sidebar-accent-foreground", className)}
        {...props}
      />
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef(
  ({ className, asChild = false, showOnHover = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        data-sidebar="menu-action"
        className={cn(
          "absolute right-1 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1.5 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
          "peer-data-[size=sm]/menu-button:top-1/2",
          "group-data-[collapsible=icon]/sidebar-wrapper:hidden",
          showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground [@media(pointer-coarse)]:opacity-100 [@media(hover)]:opacity-0",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      data-sidebar="menu-badge"
      className={cn(
        "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "group-data-[collapsible=icon]/sidebar-wrapper:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef(
  ({ className, showIcon = false, ...props }, ref) => {
    return (
      <li
        ref={ref}
        data-sidebar="menu-skeleton"
        className={cn("rounded-md h-8 flex gap-2 px-2 items-center", className)}
        {...props}
      >
        {showIcon && (
          <svg
            className="size-4 animate-pulse rounded bg-sidebar-primary/10"
            {...props}
          />
        )}
        <svg
          className="h-4 flex-1 animate-pulse rounded bg-sidebar-primary/10"
          {...props}
        />
      </li>
    )
  }
)
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
        "group-data-[collapsible=icon]/sidebar-wrapper:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef(({ ...props }, ref) => {
  return <li ref={ref} {...props} />
})
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef(
  ({ asChild = false, size = "sm", isActive = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"

    return (
      <Comp
        ref={ref}
        data-sidebar="menu-sub-button"
        data-size={size}
        data-active={isActive}
        className={cn(
          "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-foreground/50",
          "group-data-[collapsible=icon]/sidebar-wrapper:hidden",
          isActive &&
          "bg-sidebar-accent font-medium text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

function TooltipProvider({ children }) {
  return <>{children}</>
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  // useSidebar,
}
