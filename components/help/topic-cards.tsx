"use client"

import { Icon } from "@/components/icon"
import { HELP_TOPICS, type HelpTopicId } from "@/lib/data/help"
import { cn } from "@/lib/utils"

/** Five topic tiles. Selecting one filters the FAQ below; selecting it again clears the filter. */
export function TopicCards({
  selectedId,
  onSelect,
}: {
  selectedId?: HelpTopicId
  onSelect: (id: HelpTopicId) => void
}) {
  return (
    <section aria-labelledby="topics-title">
      <h2 id="topics-title" className="sr-only">
        Browse by topic
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5 [&>li:last-child]:max-md:col-span-2">
        {HELP_TOPICS.map((topic, i) => {
          const selected = topic.id === selectedId
          return (
            <li key={topic.id} className="sn-enter flex" style={{ animationDelay: `${i * 40}ms` }}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(topic.id)}
                className={cn(
                  "flex w-full cursor-pointer flex-col items-start gap-4 rounded-card p-4 text-left shadow-card outline-none",
                  "transition-colors duration-(--duration-press) ease-out-strong",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-focus)",
                  selected ? "bg-nav-active" : "bg-surface [@media(hover:hover)]:hover:bg-hover"
                )}
              >
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-md bg-control shadow-control"
                >
                  <Icon name={topic.icon} className={selected ? "text-icon-accent" : undefined} />
                </span>
                <span className="flex min-w-0 flex-col gap-1.5">
                  <span className={cn("text-sm font-medium", selected ? "text-fg-accent" : "text-fg")}>
                    {topic.label}
                  </span>
                  <span className="text-xs font-medium text-fg-muted tabular-nums">{topic.articles} articles</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
