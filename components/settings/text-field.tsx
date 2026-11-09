import type { ComponentProps } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/** The shared Input wearing Tidewell's control recipe: 30px, 1px ring, blue focus halo like the search field. */
export function TextField({ className, ...props }: ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "h-[30px] rounded-lg border-0 bg-control px-2.5 font-medium text-fg shadow-control placeholder:text-fg-placeholder",
        "transition-[box-shadow,background-color] duration-(--duration-fast) ease-out-strong",
        "[@media(hover:hover)]:hover:bg-hover focus-visible:bg-control",
        "focus-visible:ring-0 focus-visible:shadow-[0_0_0_1px_var(--accent-solid),0_0_0_4px_var(--accent-soft)]",
        "aria-invalid:ring-0 aria-invalid:shadow-[0_0_0_1px_var(--fg-negative)]",
        "disabled:bg-sunken",
        className
      )}
      {...props}
    />
  )
}
