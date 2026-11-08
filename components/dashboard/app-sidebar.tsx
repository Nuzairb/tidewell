"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HELP_NAV, PRIMARY_NAV, SECONDARY_NAV, SETTINGS_NAV, USER, type NavLink } from "@/lib/data"
import { notInPrototype } from "@/lib/prototype"

type SidebarProps = {
  collapsed: boolean
  /** true when the last toggle came from the keyboard → skip the animation */
  instant: boolean
  /** ≥1024px: docked rail. Below: off-canvas drawer. */
  isDesktop: boolean
  mobileOpen: boolean
  onToggle: () => void
  onCloseMobile: () => void
}

/** Figma node 1:5 — 260px rail, #FAFAFA, right border #E7E7E9. */
export function AppSidebar({ collapsed, instant, isDesktop, mobileOpen, onToggle, onCloseMobile }: SidebarProps) {
  const [planningOpen, setPlanningOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  const openSettings = (section: string) => {
    onCloseMobile()
    router.push(`/settings${section}`)
  }

  return (
    <aside
      data-collapsed={collapsed || undefined}
      data-instant={instant || undefined}
      data-mobile-open={mobileOpen || undefined}
      aria-label="Sidebar"
      // off-screen drawer must not be reachable by Tab / screen readers
      inert={!isDesktop && !mobileOpen}
      className={cn(
        "group/sidebar flex h-full shrink-0 flex-col overflow-hidden bg-sunken shadow-[inset_-1px_0_0_var(--border-default)]",
        "w-(--sidebar-width) data-collapsed:w-(--sidebar-width-collapsed)",
        // < lg: off-canvas drawer, slides with the iOS-style drawer curve
        "fixed inset-y-0 left-0 z-50 -translate-x-full data-mobile-open:translate-x-0",
        "data-mobile-open:shadow-[inset_-1px_0_0_var(--border-default),16px_0_48px_-8px_rgba(9,9,11,0.24)]",
        "transition-[translate,box-shadow] duration-300 ease-drawer",
        // ≥ lg: docked rail; only the width animates (collapse)
        "lg:relative lg:z-10 lg:translate-x-0 lg:transition-[width] lg:duration-(--duration-slow) lg:ease-out-strong",
        instant && "transition-none lg:transition-none"
      )}
    >
      {/* Brand — 1:6. The logo always stays; only the wordmark fades out. */}
      <div className="flex h-(--header-height) shrink-0 items-center p-4 shadow-[inset_0_-1px_0_var(--border-subtle)]">
        <div className="flex w-full items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/logo.svg"
            alt="Tidewell"
            width={24}
            height={24}
            className={cn(
              "size-6 shrink-0 transition-transform duration-(--duration-slow) ease-out-strong",
              // nudge 3px so the logo centres on the 62px rail (same axis as the nav icons)
              "group-data-collapsed/sidebar:translate-x-[3px]",
              "group-data-instant/sidebar:transition-none"
            )}
          />
          <span
            aria-hidden={collapsed}
            className={cn(
              "min-w-0 flex-1 truncate text-lg font-semibold text-fg-strong",
              "transition-opacity duration-(--duration-fast) ease-out-strong group-data-collapsed/sidebar:opacity-0",
              "group-data-instant/sidebar:transition-none"
            )}
          >
            Tidewell
          </span>
          {/* reserves the toggle's slot in the expanded row */}
          <span aria-hidden className="w-[30px] shrink-0" />
        </div>
      </div>

      {/*
        Sidebar toggle. One element that glides between two slots:
          expanded  → right end of the brand row   (x 214, y 16)
          collapsed → under the logo, top of nav   (x 16,  y 78)
        Only `transform` animates (GPU), in step with the rail's width.
      */}
      <div
        className={cn(
          "absolute top-0 left-0 z-20 translate-x-[214px] translate-y-4",
          "group-data-collapsed/sidebar:translate-x-4 group-data-collapsed/sidebar:translate-y-[78px]",
          "transition-transform duration-(--duration-slow) ease-out-strong",
          "group-data-instant/sidebar:transition-none"
        )}
      >
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="raised"
                size="icon"
                aria-label={!isDesktop ? "Close menu" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-expanded={isDesktop ? !collapsed : undefined}
                onClick={isDesktop ? onToggle : onCloseMobile}
              />
            }
          >
            <Icon
              name="align-left-01"
              className={cn(
                "transition-transform duration-(--duration-slow) ease-out-strong group-data-instant/sidebar:transition-none",
                collapsed && "-scale-x-100"
              )}
            />
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {!isDesktop ? "Close menu" : `${collapsed ? "Expand" : "Collapse"} sidebar`} <Kbd>⌘B</Kbd>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Navigation — 1:14 */}
      <nav aria-label="Main" className="flex min-h-0 flex-1 flex-col p-4">
        <div className="flex min-h-0 flex-1 flex-col gap-5">
          <div className="-mx-4 flex min-h-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto px-4 [scrollbar-width:none]">
            <div className="flex flex-col">
              {/* opens a 30px + 8px slot for the toggle when the rail is collapsed */}
              <div
                aria-hidden
                className={cn(
                  "grid grid-rows-[0fr] transition-[grid-template-rows] duration-(--duration-slow) ease-out-strong",
                  "group-data-collapsed/sidebar:grid-rows-[1fr] group-data-instant/sidebar:transition-none"
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="h-[38px]" />
                </div>
              </div>
              <ul className="flex flex-col gap-0.5">
                {PRIMARY_NAV.map((item) => (
                  <li key={item.id}>
                    <NavItem
                      item={item}
                      collapsed={collapsed}
                      active={item.href === pathname}
                      onNavigate={onCloseMobile}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <Divider />

            <ul className="flex flex-col gap-0.5">
              {SECONDARY_NAV.map((group) => {
                const hasChildren = !!group.children?.length
                const open = group.id === "planning" ? planningOpen : false
                if (!hasChildren) {
                  return (
                    <li key={group.id}>
                      <NavItem
                        item={group}
                        collapsed={collapsed}
                        active={group.href === pathname}
                        onNavigate={onCloseMobile}
                      />
                    </li>
                  )
                }
                return (
                  <li key={group.id}>
                    <NavItem
                      item={group}
                      collapsed={collapsed}
                      trailing={<Icon name="chevron-down" />}
                      aria-expanded={open && !collapsed}
                      onClick={() => {
                        if (collapsed) {
                          onToggle()
                          setPlanningOpen(true)
                          return
                        }
                        setPlanningOpen((v) => !v)
                      }}
                    />
                    <Collapsible open={open && !collapsed}>
                      <div className="flex pt-0.5">
                        {/* tree guide — Figma asset 1:54, 30×126 */}
                        <div className="relative w-[30px] shrink-0 self-stretch">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/figma/nav-tree-lines.svg"
                            alt=""
                            width={30}
                            height={126}
                            className="absolute inset-0 block size-full max-w-none dark:opacity-20"
                          />
                        </div>
                        <ul className="flex min-w-0 flex-1 flex-col gap-0.5">
                          {group.children!.map((child) => (
                            <li key={child.id}>
                              <NavItem
                                item={child}
                                collapsed={collapsed}
                                active={child.href === pathname}
                                onNavigate={onCloseMobile}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Collapsible>
                  </li>
                )
              })}
            </ul>

            <Divider />

            <ul className="flex flex-col">
              <li>
                <NavItem
                  item={HELP_NAV}
                  collapsed={collapsed}
                  active={HELP_NAV.href === pathname}
                  onNavigate={onCloseMobile}
                />
              </li>
            </ul>
          </div>

          {/* Preferences — 1:105 (dark-mode row removed by request) */}
          <div className="flex shrink-0 flex-col gap-0.5">
            <NavItem
              item={SETTINGS_NAV}
              collapsed={collapsed}
              active={SETTINGS_NAV.href === pathname}
              onNavigate={onCloseMobile}
            />
          </div>
        </div>
      </nav>

      {/* Profile — 1:117 */}
      <div className="h-(--profile-height) shrink-0 shadow-[inset_0_1px_0_var(--border-default)]">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "flex h-full w-full cursor-pointer items-center gap-3 px-6 py-4 text-left outline-none",
              "transition-[background-color,padding] duration-(--duration-press) ease-out-strong",
              "[@media(hover:hover)]:hover:bg-nav-hover data-popup-open:bg-nav-hover",
              "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-focus)",
              "group-data-collapsed/sidebar:px-[12px]"
            )}
            aria-label={`Account menu for ${USER.name}`}
          >
            <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-avatar p-2 shadow-avatar">
              <span className="font-avatar text-sm leading-none font-semibold tracking-[-0.015em] whitespace-nowrap text-fg-accent">
                {USER.initials}
              </span>
            </span>
            <span className="flex h-9 min-w-0 flex-col justify-center gap-1.5 leading-none whitespace-nowrap transition-opacity duration-(--duration-fast) group-data-collapsed/sidebar:opacity-0">
              <span className="text-sm font-medium tracking-label text-fg">{USER.name}</span>
              <span className="text-xs font-medium text-fg-muted">{USER.email}</span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" sideOffset={6} className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-fg-muted">{USER.email}</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => openSettings("#profile")}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openSettings("#billing")}>Billing</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openSettings("")}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => notInPrototype("Sign out")}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}

function NavItem({
  item,
  active = false,
  collapsed,
  trailing,
  onClick,
  onNavigate,
  ...rest
}: {
  item: NavLink
  active?: boolean
  collapsed: boolean
  trailing?: ReactNode
  onClick?: () => void
  /** closes the drawer after following a link (< lg) */
  onNavigate?: () => void
  "aria-expanded"?: boolean
}) {
  const className = cn(
    "flex h-[30px] w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none",
    "transition-colors duration-(--duration-press) ease-out-strong",
    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-focus)",
    active
      ? "bg-nav-active"
      : "[@media(hover:hover)]:hover:bg-nav-hover active:bg-nav-hover [@media(hover:hover)]:hover:[&_[data-icon]]:text-icon-hover [@media(hover:hover)]:hover:[&_.nav-label]:text-fg"
  )
  const content = (
    <>
      <Icon name={item.icon} className={active ? "text-icon-accent" : undefined} />
      <span className="flex min-w-0 flex-1 items-center px-[2px] transition-opacity duration-(--duration-fast) group-data-collapsed/sidebar:opacity-0">
        <span
          className={cn(
            "nav-label truncate text-sm font-medium transition-colors duration-(--duration-press)",
            active ? "text-fg-accent" : "text-fg-muted"
          )}
        >
          {item.label}
        </span>
      </span>
      {trailing}
    </>
  )

  return (
    <SidebarTooltip label={item.label} enabled={collapsed}>
      {item.href ? (
        <Link href={item.href} aria-current={active ? "page" : undefined} onClick={onNavigate} className={className}>
          {content}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick ?? (() => notInPrototype(item.label))}
          className={className}
          {...rest}
        >
          {content}
        </button>
      )}
    </SidebarTooltip>
  )
}

function SidebarTooltip({ label, enabled, children }: { label: string; enabled: boolean; children: React.ReactElement }) {
  if (!enabled) return children
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side="right" sideOffset={10}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

/** Height-auto collapse via grid rows — no JS measuring, interruptible. */
function Collapsible({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-(--duration-base) ease-out-strong",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}

/** Full-bleed 1px rule — Figma 1:44 / 1:98 (260px wide, #ECECEC). */
function Divider() {
  return <div aria-hidden className="-mx-4 h-px shrink-0 bg-line-divider" />
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="ml-1 rounded-[4px] bg-white/15 px-1 py-0.5 font-sans text-[11px] leading-none font-medium">
      {children}
    </kbd>
  )
}
