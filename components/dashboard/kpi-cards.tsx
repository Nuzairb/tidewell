"use client"

import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { KPIS, type Kpi } from "@/lib/data"
import { notInPrototype } from "@/lib/prototype"
import { cn } from "@/lib/utils"

/** Figma node 1:159 — four equal cards, 16px gap. */
export function KpiCards() {
  return (
    <section aria-label="Summary" className="grid w-full grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {KPIS.map((kpi, i) => (
        <KpiCard key={kpi.id} kpi={kpi} index={i} />
      ))}
    </section>
  )
}

function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  const positive = kpi.sentiment === "positive"
  return (
    <article
      className="sn-enter flex min-w-0 flex-col overflow-hidden rounded-card bg-surface p-3 shadow-card sm:p-4"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex items-center gap-2.5">
          <h2 className="min-w-0 flex-1 truncate text-sm font-medium tracking-label text-fg-muted">{kpi.label}</h2>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  size="icon-sm"
                  aria-label={`Open ${kpi.action}`}
                  onClick={() => notInPrototype(kpi.action)}
                />
              }
            >
              <Icon name={kpi.icon} />
            </TooltipTrigger>
            <TooltipContent side="top">Open {kpi.action}</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="truncate font-mono text-xl font-semibold text-fg-numeric tabular-nums sm:text-2xl">
            {kpi.value}
          </p>
          <p className="flex min-w-0 items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={positive ? "/figma/triangle-up.svg" : "/figma/triangle-up-red.svg"}
              alt=""
              width={10}
              height={10}
              className={cn("size-2.5 shrink-0", kpi.trend === "down" && "rotate-180")}
            />
            <span className="truncate text-xs font-medium tracking-label sm:text-sm">
              <span className={positive ? "text-positive" : "text-negative"}>{kpi.change} </span>
              <span className="text-fg-muted">{kpi.context}</span>
            </span>
          </p>
        </div>
      </div>
    </article>
  )
}
