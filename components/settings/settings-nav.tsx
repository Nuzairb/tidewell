"use client"

import { Icon } from "@/components/icon"
import type { SettingsSection } from "@/lib/data/settings"
import { cn } from "@/lib/utils"

/** lg+ only: sticky in-page index that follows the scroll position, styled like sidebar rows. */
export function SettingsNav({
  sections,
  active,
  onNavigate,
}: {
  sections: SettingsSection[]
  active?: string
  onNavigate: (id: string) => void
}) {
  return (
    <nav
      aria-label="Settings sections"
      className="sn-enter sticky top-6 hidden self-start rounded-card bg-surface p-2 shadow-card lg:block"
    >
      <ul className="flex flex-col gap-0.5">
        {sections.map((section) => {
          const current = section.id === active
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={current ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate(section.id)
                }}
                className={cn(
                  "flex h-[30px] items-center gap-2 rounded-md p-2 outline-none",
                  "transition-colors duration-(--duration-press) ease-out-strong",
                  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-focus)",
                  current
                    ? "bg-nav-active"
                    : "[@media(hover:hover)]:hover:bg-nav-hover [@media(hover:hover)]:hover:[&_span]:text-fg"
                )}
              >
                <Icon name={section.icon} className={current ? "text-icon-accent" : undefined} />
                <span
                  className={cn(
                    "truncate px-[2px] text-sm font-medium transition-colors duration-(--duration-press)",
                    current ? "text-fg-accent" : "text-fg-muted"
                  )}
                >
                  {section.label}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
