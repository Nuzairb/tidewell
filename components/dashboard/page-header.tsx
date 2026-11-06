"use client"

import { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { NOTIFICATIONS, SHORTCUTS } from "@/lib/data"

/** Figma node 1:125 — 62px header, white, bottom border #E7E7E7. */
export function PageHeader({
  query,
  onQueryChange,
  onOpenMenu,
}: {
  query: string
  onQueryChange: (q: string) => void
  onOpenMenu: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  // < md the search field lives behind an icon and expands over the header
  const [mobileSearch, setMobileSearch] = useState(false)

  // "/" focuses search from anywhere (no animation — keyboard actions are instant)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target
      const typing = el instanceof Element && el.closest("input, textarea, [contenteditable=true]")
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        flushSync(() => setMobileSearch(true))
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <header className="relative flex h-(--header-height) shrink-0 items-center bg-surface p-4 shadow-[inset_0_-1px_0_var(--border-subtle)]">
      <div className="flex w-full items-center justify-between gap-3 md:gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <Button
            variant="raised"
            size="icon"
            className="lg:hidden"
            aria-label="Open menu"
            onClick={onOpenMenu}
          >
            <Icon name="align-left-01" className="-scale-x-100" />
          </Button>
          {/* The sidebar (and its logo) is a hidden drawer below lg, so the brand mark lives here */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/logo.svg" alt="Statsnap" width={24} height={24} className="size-6 shrink-0 lg:hidden" />
          <span aria-hidden className="h-3 w-px shrink-0 bg-line lg:hidden" />
          <h1 className="text-base font-semibold whitespace-nowrap text-fg-strong">Reports</h1>
          <span aria-hidden className="hidden h-3 w-px shrink-0 bg-line md:block" />
          <p className="hidden truncate text-sm font-medium text-fg-muted md:block">
            Track your finances and spending habits.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* compact search trigger (phones) */}
          <Button
            size="icon"
            className="md:hidden"
            aria-label="Search transactions"
            aria-expanded={mobileSearch}
            onClick={() => {
              // render the field first, then focus it inside the same tap so iOS opens the keyboard
              flushSync(() => setMobileSearch(true))
              inputRef.current?.focus()
            }}
          >
            <Icon name="search-lg" />
          </Button>

          {/*
            One input for every breakpoint. ≥ md it sits inline (240px);
            < md it becomes a full-width bar over the header with a Cancel action.
          */}
          <div
            className={cn(
              "items-center gap-2 md:static md:flex",
              mobileSearch
                ? "absolute inset-0 z-10 flex bg-surface px-4 shadow-[inset_0_-1px_0_var(--border-subtle)] md:p-0 md:shadow-none"
                : "hidden"
            )}
          >
          <label
            className={cn(
              "flex h-[30px] w-full cursor-text items-center gap-1 overflow-hidden rounded-lg bg-surface p-2 shadow-control md:w-60",
              "transition-[box-shadow,background-color] duration-(--duration-fast) ease-out-strong",
              "[@media(hover:hover)]:hover:bg-hover focus-within:bg-surface focus-within:shadow-[0_1px_2px_0_rgba(40,40,40,0.08),0_0_0_1px_var(--accent-solid),0_0_0_4px_var(--accent-soft)]"
            )}
          >
            <Icon name="search-lg" />
            <span className="flex min-w-0 flex-1 items-center px-[2px]">
              <input
                ref={inputRef}
                type="search"
                enterKeyHint="search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    onQueryChange("")
                    setMobileSearch(false)
                    e.currentTarget.blur()
                  }
                }}
                placeholder="Search..."
                aria-label="Search transactions"
                // 16px on phones stops iOS Safari from zooming into the field
                className="w-full min-w-0 bg-transparent text-base leading-none font-medium tracking-normal text-fg outline-none placeholder:text-fg-placeholder md:text-sm [&::-webkit-search-cancel-button]:hidden"
              />
            </span>
          </label>
            <Button
              variant="link"
              className="h-[30px] shrink-0 px-1 no-underline md:hidden"
              onClick={() => {
                onQueryChange("")
                setMobileSearch(false)
              }}
            >
              Cancel
            </Button>
          </div>

          <span aria-hidden className="hidden h-3 w-px bg-line md:block" />

          <Popover>
            <Tooltip>
              <TooltipTrigger
                render={<PopoverTrigger render={<Button size="icon" className="hidden md:inline-flex" aria-label="Help and keyboard shortcuts" />} />}
              >
                <Icon name="help-circle" />
              </TooltipTrigger>
              <TooltipContent side="bottom">Help</TooltipContent>
            </Tooltip>
            <PopoverContent align="end" sideOffset={8} className="w-72 gap-3 p-3">
              <p className="text-sm font-semibold text-fg">Keyboard shortcuts</p>
              <ul className="flex flex-col gap-2">
                {SHORTCUTS.map((s) => (
                  <li key={s.label} className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-fg-muted">{s.label}</span>
                    <span className="flex gap-1">
                      {s.keys.map((k) => (
                        <kbd
                          key={k}
                          className="flex h-5 min-w-5 items-center justify-center rounded-[5px] bg-sunken px-1 font-sans text-xs font-medium text-fg-muted shadow-control"
                        >
                          {k}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>

          <Notifications />
        </div>
      </div>
    </header>
  )
}

function Notifications() {
  const [items, setItems] = useState(NOTIFICATIONS)
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger render={<PopoverTrigger render={<Button size="icon" aria-label="Notifications" />} />}>
          <Icon name="bell-01" />
        </TooltipTrigger>
        <TooltipContent side="bottom">Notifications</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" sideOffset={8} className="w-80 gap-0 p-0">
        <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
          <p className="text-sm font-semibold text-fg">Notifications</p>
          <Button
            variant="link"
            size="xs"
            className="h-auto p-0 text-xs"
            disabled={!items.length}
            onClick={() => setItems([])}
          >
            Clear all
          </Button>
        </div>
        {items.length ? (
          <ul className="flex flex-col p-1">
            {items.map((n) => (
              <li key={n.id} className="flex flex-col gap-1.5 rounded-lg px-2.5 py-2.5 [@media(hover:hover)]:hover:bg-hover">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-fg">{n.title}</span>
                  <span className="text-xs font-medium text-fg-subtle">{n.time}</span>
                </div>
                <span className="text-xs leading-[1.4] font-medium text-fg-muted">{n.body}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-3 py-8 text-center text-sm font-medium text-fg-muted">You&apos;re all caught up.</p>
        )}
      </PopoverContent>
    </Popover>
  )
}
