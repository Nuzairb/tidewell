"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

/**
 * The skeuomorphic toggle from Figma (node 1:110): gradient track, glossy
 * thumb with layered shadows. Thumb slides 14px with a strong ease-out — no
 * spring, no overshoot.
 */
export function ThemeToggle({
  checked,
  onCheckedChange,
  className,
  ...props
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
} & Omit<SwitchPrimitive.Root.Props, "checked" | "onCheckedChange" | "className">) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        "group/toggle relative h-[18px] w-8 shrink-0 cursor-pointer rounded-pill",
        "border-[0.2px] border-solid border-(--toggle-track-border)",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-focus)",
        className
      )}
      {...props}
    >
      {/* track fill */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-pill bg-linear-to-r from-(--toggle-track-from) from-[26.389%] to-(--toggle-track-to)"
      />
      {/* track inner shadow */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[var(--shadow-toggle)]" />
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none absolute top-[-0.2px] left-[-0.2px] size-[18px] rounded-pill",
          "shadow-[var(--shadow-toggle-thumb)]",
          "transition-transform duration-(--duration-base) ease-out-strong",
          "data-checked:translate-x-[14px]"
        )}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-pill"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%), linear-gradient(180deg, var(--toggle-thumb-from) 0%, var(--toggle-thumb-to) 85.727%)",
          }}
        />
        <span aria-hidden className="absolute inset-0 rounded-[inherit] shadow-[var(--shadow-toggle-thumb-inner)]" />
        {/* glossy highlight */}
        <span aria-hidden className="absolute top-[4px] left-[4px] size-2 bg-white blur-[4.8px]" />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}
