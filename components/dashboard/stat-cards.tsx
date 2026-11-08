"use client"

import Link from "next/link"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { IconName } from "@/lib/data"
import { notInPrototype } from "@/lib/prototype"
import { cn } from "@/lib/utils"

export type Stat = {
  id: string
  label: string
  value: string
  /** muted context after the change, or the whole line when there's no change */
  context: string
  change?: { text: string; trend: "up" | "down"; sentiment: "positive" | "negative" }
  icon: IconName
  action: string
  href?: string
}

/**
 * The KPI card recipe (kpi-cards.tsx) where the change line is optional, shared by Analytics and Recurring:
 * some figures ("average per month") have context but no trend to colour.
 */
export function StatCards({ items, label }: { items: Stat[]; label: string }) {
  return (
    <section aria-label={label} className="grid w-full grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {items.map((stat, i) => (
        <StatCard key={stat.id} stat={stat} index={i} />
      ))}
    </section>
  )
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const { label, value, context, change, icon, action, href } = stat
  const positive = change?.sentiment === "positive"
  return (
    <article
      className="sn-enter flex min-w-0 flex-col overflow-hidden rounded-card bg-surface p-3 shadow-card sm:p-4"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex items-center gap-2.5">
          <h2 className="min-w-0 flex-1 truncate text-sm font-medium tracking-label text-fg-muted">{label}</h2>
          <Tooltip>
            <TooltipTrigger
              render={
                href ? (
                  <Button size="icon-sm" aria-label={`Open ${action}`} nativeButton={false} render={<Link href={href} />} />
                ) : (
                  <Button size="icon-sm" aria-label={`Open ${action}`} onClick={() => notInPrototype(action)} />
                )
              }
            >
              <Icon name={icon} />
            </TooltipTrigger>
            <TooltipContent side="top">Open {action}</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="truncate font-mono text-xl font-semibold text-fg-numeric tabular-nums sm:text-2xl">{value}</p>
          <p className="flex min-w-0 items-center gap-1.5">
            {change && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={positive ? "/figma/triangle-up.svg" : "/figma/triangle-up-red.svg"}
                alt=""
                width={10}
                height={10}
                className={cn("size-2.5 shrink-0", change.trend === "down" && "rotate-180")}
              />
            )}
            <span className="truncate text-xs font-medium tracking-label sm:text-sm">
              {change && <span className={positive ? "text-positive" : "text-negative"}>{change.text} </span>}
              <span className="text-fg-muted">{context}</span>
            </span>
          </p>
        </div>
      </div>
    </article>
  )
}
