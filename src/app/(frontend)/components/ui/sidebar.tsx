'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

// Constants
const SIDEBAR_WIDTH = '18rem'
const SIDEBAR_WIDTH_ICON = '4rem'
const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

// Context
type SidebarContextType = {
  open: boolean
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void
  state: 'expanded' | 'collapsed'
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

// Provider
interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  children,
  className,
  ...props
}: SidebarProviderProps) {
  const [_open, _setOpen] = React.useState(defaultOpen)

  const open = openProp !== undefined ? openProp : _open
  const state: 'expanded' | 'collapsed' = open ? 'expanded' : 'collapsed'

  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // Set cookie to persist state
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open],
  )

  // Value for the context
  const value = React.useMemo(() => ({ open, setOpen, state }), [open, setOpen, state])

  return (
    <SidebarContext.Provider value={value}>
      <div className={cn('flex flex-row text-gray-800 dark:text-gray-200', className)} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

// Sidebar component
const sidebarVariants = cva(
  'group/sidebar relative flex h-full flex-col overflow-hidden border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out',
  {
    variants: {
      state: {
        expanded: 'w-[--sidebar-width]',
        collapsed: 'w-[--sidebar-width-icon]',
      },
    },
    defaultVariants: {
      state: 'expanded',
    },
  },
)

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  collapsible?: boolean
}

export function Sidebar({ children, className, collapsible = true, ...props }: SidebarProps) {
  const { state } = useSidebar()

  return (
    <aside
      data-collapsible={collapsible ? state : 'none'}
      className={cn(sidebarVariants({ state: collapsible ? state : 'expanded' }), className)}
      style={
        {
          '--sidebar-width': SIDEBAR_WIDTH,
          '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </aside>
  )
}

// Sidebar content
export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex-1 overflow-auto', className)} {...props} />
}

// Sidebar header
export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-14 shrink-0 items-center border-b border-gray-200 dark:border-gray-800 px-4',
        className,
      )}
      {...props}
    />
  )
}

// Sidebar footer
export function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-14 shrink-0 items-center border-t border-gray-200 dark:border-gray-800 px-4',
        className,
      )}
      {...props}
    />
  )
}

// Sidebar trigger button
export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = useSidebar()

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
        className,
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
}

// Sidebar section
export function SidebarSection({
  title,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { title?: string }) {
  return (
    <div className={cn('py-2', className)} {...props}>
      {title && (
        <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

// Sidebar item
export function SidebarItem({
  children,
  className,
  active = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { active?: boolean }) {
  return (
    <div
      className={cn(
        'group flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800',
        active && 'bg-gray-100 dark:bg-gray-800 font-medium',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Sidebar group
export function SidebarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-1', className)} {...props} />
}
