import { SectionCard } from "@/components/dashboard/section-card"
import { SHORTCUTS } from "@/lib/data"

/** The same shortcuts as the header's Help popover, with room to breathe. */
export function ShortcutsCard({ className }: { className?: string }) {
  return (
    <SectionCard id="shortcuts" title="Keyboard shortcuts" delay={280} className={className}>
      <ul className="flex flex-col border-t border-line">
        {SHORTCUTS.map((s) => (
          <li
            key={s.label}
            className="flex min-h-[45px] items-center justify-between gap-3 border-b border-line px-4 py-2 last:border-b-0"
          >
            <span className="text-sm font-medium text-fg-muted">{s.label}</span>
            <span className="flex shrink-0 gap-1">
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
    </SectionCard>
  )
}
