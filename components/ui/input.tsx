import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

/**
 * shadcn Input, re-skinned like the header search: 30px, ring instead of a
 * border, accent ring + soft halo on focus. 16px text on phones stops iOS
 * zooming into the field.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-[30px] w-full min-w-0 rounded-lg bg-surface px-2.5 text-base leading-none font-medium tracking-normal text-fg shadow-control outline-none md:text-sm",
        "transition-[box-shadow,background-color] duration-(--duration-fast) ease-out-strong",
        "placeholder:text-fg-placeholder [@media(hover:hover)]:hover:bg-hover",
        "focus-visible:bg-surface focus-visible:shadow-[0_1px_2px_0_rgba(40,40,40,0.08),0_0_0_1px_var(--accent-solid),0_0_0_4px_var(--accent-soft)]",
        "aria-invalid:shadow-[0_0_0_1px_var(--fg-negative)] aria-invalid:focus-visible:shadow-[0_0_0_1px_var(--fg-negative),0_0_0_4px_color-mix(in_srgb,var(--fg-negative)_16%,transparent)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
