import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Card frame shared by Home and Accounts: title row (p-16) + body. */
export function SectionCard({
  id,
  title,
  action,
  delay,
  className,
  children,
}: {
  id: string
  title: string
  action?: ReactNode
  /** page-load stagger, ms */
  delay: number
  className?: string
  children: ReactNode
}) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className={cn("sn-enter flex min-w-0 flex-col overflow-hidden rounded-card bg-surface shadow-card", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex h-[62px] shrink-0 items-center justify-between gap-3 p-4">
        <h2 id={`${id}-title`} className="truncate text-base leading-[22px] font-semibold text-fg">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}
