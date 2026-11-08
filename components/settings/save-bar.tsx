"use client"

import { Button } from "@/components/ui/button"

/** Floats at the bottom of the scroller while there are unsaved edits. */
export function SaveBar({
  canSave,
  onSave,
  onDiscard,
}: {
  canSave: boolean
  onSave: () => void
  onDiscard: () => void
}) {
  return (
    <div
      role="region"
      aria-label="Unsaved changes"
      className="sticky bottom-4 z-10 flex animate-in items-center justify-between gap-3 rounded-card bg-surface py-3 pr-3 pl-4 shadow-popover duration-150 ease-out-strong fade-in-0 slide-in-from-bottom-1"
    >
      <p className="truncate text-sm font-medium text-fg">
        {canSave ? "Unsaved changes" : "Fix the highlighted fields"}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <Button onClick={onDiscard}>
          <span className="px-[2px]">Discard</span>
        </Button>
        <Button variant="default" disabled={!canSave} onClick={onSave}>
          <span className="px-[2px]">Save changes</span>
        </Button>
      </div>
    </div>
  )
}
