"use client"

import type { ReactNode } from "react"
import { SectionCard } from "@/components/dashboard/section-card"
import { Button } from "@/components/ui/button"
import { SUPPORT } from "@/lib/data/help"
import { notInPrototype } from "@/lib/prototype"

/** Ways to reach a person, how fast they answer, and whether Tidewell is up. */
export function ContactCard({ className }: { className?: string }) {
  return (
    <SectionCard id="contact" title="Contact support" delay={240} className={className}>
      <ul className="flex flex-col border-t border-line">
        <ContactRow
          label="Email us"
          detail={SUPPORT.email}
          action={
            <Button
              className="h-[26px] rounded-md px-2"
              nativeButton={false}
              render={<a href={`mailto:${SUPPORT.email}`} />}
            >
              Email
            </Button>
          }
        />
        <ContactRow
          label="Live chat"
          detail={SUPPORT.chatHours}
          action={
            <Button className="h-[26px] rounded-md px-2" onClick={() => notInPrototype("Live chat")}>
              Start chat
            </Button>
          }
        />
        <li className="flex h-[45px] items-center justify-between gap-3 border-b border-line px-4">
          <span className="text-sm font-medium text-fg-muted">Typical reply time</span>
          <span className="text-sm font-medium text-fg">{SUPPORT.replyTime}</span>
        </li>
      </ul>
      <div
        role="status"
        className="mt-auto flex h-[45px] items-center justify-between gap-3 bg-sunken px-4"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden className="size-2 shrink-0 rounded-full bg-positive" />
          <span className="truncate text-sm font-medium text-fg">{SUPPORT.status}</span>
        </span>
        <span className="shrink-0 text-xs font-medium text-fg-muted">Checked {SUPPORT.statusCheckedAgo}</span>
      </div>
    </SectionCard>
  )
}

function ContactRow({ label, detail, action }: { label: string; detail: string; action: ReactNode }) {
  return (
    <li className="flex h-[60px] items-center gap-3 border-b border-line px-4">
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="truncate text-sm font-medium text-fg">{label}</span>
        <span className="truncate text-xs font-medium text-fg-muted">{detail}</span>
      </span>
      {action}
    </li>
  )
}
