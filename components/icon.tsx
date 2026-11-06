import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"
import type { IconName } from "@/lib/data"

/**
 * Renders a Figma-exported icon (public/figma/<name>.svg) as a CSS mask so it
 * can be tinted with design tokens (text-icon, text-icon-accent, …) and adapt
 * to dark mode. Geometry is the untouched Figma asset at its native 14×14.
 */
export function Icon({
  name,
  size = 14,
  className,
  style,
}: {
  name: IconName
  size?: number
  className?: string
  style?: CSSProperties
}) {
  const url = `url(/figma/${name}.svg)`
  return (
    <span
      aria-hidden
      data-icon={name}
      className={cn("sn-icon text-icon", className)}
      style={{ width: size, height: size, maskImage: url, WebkitMaskImage: url, ...style }}
    />
  )
}
