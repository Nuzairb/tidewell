import { INSIGHTS } from "@/components/analytics/analytics-stats"
import { SectionCard } from "@/components/dashboard/section-card"
import { Icon } from "@/components/icon"

/** Plain-language takeaways, each derived from the figures on this page. */
export function InsightsCard({ className }: { className?: string }) {
  return (
    <SectionCard id="insights" title="Worth knowing" delay={280} className={className}>
      <ul className="flex flex-col border-t border-line">
        {INSIGHTS.map(({ id, icon, title, body }) => (
          <li key={id} className="flex items-start gap-3 border-b border-line px-4 py-3.5 last:border-b-0">
            <span
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center rounded-md bg-surface shadow-control"
            >
              <Icon name={icon} />
            </span>
            <span className="flex min-w-0 flex-col gap-1.5 pt-0.5">
              <span className="text-sm font-medium text-fg">{title}</span>
              <span className="text-xs leading-[1.4] font-medium text-fg-muted tabular-nums">{body}</span>
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
