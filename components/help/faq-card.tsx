"use client"

import { useState, type ReactNode } from "react"
import { CardAction } from "@/components/dashboard/card-action"
import { SectionCard } from "@/components/dashboard/section-card"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import type { Faq, HelpTopic } from "@/lib/data/help"
import { cn } from "@/lib/utils"

/** Accordion of common questions, filtered by the selected topic and the header search. */
export function FaqCard({
  faqs,
  topic,
  query,
  onClearTopic,
  onClearQuery,
  className,
}: {
  faqs: Faq[]
  topic?: HelpTopic
  query: string
  onClearTopic: () => void
  onClearQuery: () => void
  className?: string
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set())

  const toggle = (id: string) =>
    setOpenIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <SectionCard
      id="faq"
      title={topic ? `${topic.label} questions` : "Frequently asked questions"}
      action={
        topic ? (
          <Button className="rounded-md" onClick={onClearTopic}>
            <span className="px-[2px] leading-none font-medium">All topics</span>
          </Button>
        ) : (
          <CardAction label="Help center" feature="The help center" />
        )
      }
      delay={200}
      className={className}
    >
      {faqs.length ? (
        <ul className="flex flex-col border-t border-line">
          {faqs.map((faq) => (
            <FaqItem key={faq.id} faq={faq} open={openIds.has(faq.id)} onToggle={() => toggle(faq.id)} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-3 border-t border-line px-4 py-10 text-center">
          <p className="text-sm font-medium text-fg-muted">
            {query ? `No answers match “${query}”` : "No answers here yet"}
            {topic && ` in ${topic.label}`}.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {query && <Button onClick={onClearQuery}>Clear search</Button>}
            {topic && <Button onClick={onClearTopic}>Search all topics</Button>}
          </div>
        </div>
      )}
    </SectionCard>
  )
}

function FaqItem({ faq, open, onToggle }: { faq: Faq; open: boolean; onToggle: () => void }) {
  const panelId = `faq-${faq.id}-answer`
  const buttonId = `faq-${faq.id}-question`
  return (
    <li className="border-b border-line last:border-b-0">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={cn(
            "flex min-h-[45px] w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left outline-none",
            "transition-colors duration-(--duration-press) ease-out-strong [@media(hover:hover)]:hover:bg-hover",
            "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-focus)"
          )}
        >
          <span className="text-sm leading-[1.3] font-medium text-fg">{faq.question}</span>
          <Icon
            name="chevron-down"
            className={cn("transition-transform duration-(--duration-base) ease-out-strong", open && "rotate-180")}
          />
        </button>
      </h3>
      <Collapsible id={panelId} labelledBy={buttonId} open={open}>
        <p className="max-w-[640px] px-4 pb-4 text-sm leading-[1.5] font-medium text-fg-muted">{faq.answer}</p>
      </Collapsible>
    </li>
  )
}

/** Same grid-rows collapse as the sidebar's Planning group — height-auto, interruptible. */
function Collapsible({
  id,
  labelledBy,
  open,
  children,
}: {
  id: string
  labelledBy: string
  open: boolean
  children: ReactNode
}) {
  return (
    <div
      id={id}
      role="region"
      aria-labelledby={labelledBy}
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
