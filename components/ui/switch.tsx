"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

/**
 * shadcn Switch, re-skinned with the Figma toggle tokens (DESIGN_SYSTEM §6–7):
 * gradient track + raised thumb when off, solid accent when on.
 * Thumb slides 200ms `ease-out-strong`; the hit area extends past the 32×18 track.
 */
function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer relative inline-flex h-[18px] w-8 shrink-0 cursor-pointer items-center rounded-pill border p-px outline-none",
        "after:absolute after:-inset-x-2 after:-inset-y-2.5",
        "transition-[background-color,border-color] duration-(--duration-base) ease-out-strong",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-focus)",
        "data-unchecked:border-(--toggle-track-border) data-unchecked:bg-linear-to-b data-unchecked:from-(--toggle-track-from) data-unchecked:to-(--toggle-track-to) data-unchecked:shadow-(--shadow-toggle)",
        "data-checked:border-transparent data-checked:bg-accent-solid",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-3.5 rounded-full bg-linear-to-b from-(--toggle-thumb-from) to-(--toggle-thumb-to) shadow-(--shadow-toggle-thumb)",
          "transition-transform duration-(--duration-base) ease-out-strong data-checked:translate-x-3.5"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
