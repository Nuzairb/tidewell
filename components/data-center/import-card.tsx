"use client"

import { useState } from "react"
import { SectionCard } from "@/components/dashboard/section-card"
import { Icon } from "@/components/icon"
import { notInPrototype } from "@/lib/prototype"
import { cn } from "@/lib/utils"

const FEATURE = "Importing files"

/** Dropzone for bank exports. Highlights on drag so it reads as real; the import itself is coming soon. */
export function ImportCard({ className }: { className?: string }) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <SectionCard id="import" title="Import" delay={80} className={className}>
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={() => notInPrototype(FEATURE)}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            notInPrototype(FEATURE)
          }}
          className={cn(
            "flex w-full cursor-pointer flex-col items-center gap-2.5 rounded-lg border border-dashed px-4 py-8 outline-none",
            "transition-colors duration-(--duration-press) ease-out-strong",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-focus)",
            isDragging
              ? "border-accent-solid bg-accent-soft"
              : "border-line bg-sunken [@media(hover:hover)]:hover:bg-hover"
          )}
        >
          <span aria-hidden className="flex size-9 items-center justify-center rounded-md bg-surface shadow-control">
            <Icon name="file-03" className={isDragging ? "text-icon-accent" : undefined} />
          </span>
          <span className="text-sm font-medium text-fg">Drop a CSV or OFX file</span>
          <span className="text-xs font-medium text-fg-muted">or click to choose one from your computer</span>
        </button>
      </div>
    </SectionCard>
  )
}
