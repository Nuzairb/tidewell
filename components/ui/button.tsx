import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * shadcn Button, re-skinned with Tidewell tokens.
 *
 * Product rule: buttons NEVER bounce — no scale, no translate on :active.
 * Press feedback = background + shadow shift (120ms, strong ease-out).
 * Hover styles are gated behind (hover: hover) so touch devices don't stick.
 */
const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center whitespace-nowrap select-none outline-none",
    "font-medium text-sm",
    "transition-[background-color,box-shadow,color] duration-(--duration-press) ease-out-strong",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-focus)",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
    "cursor-pointer",
  ].join(" "),
  {
    variants: {
      variant: {
        /** White control with 1px ring — header buttons, search, "View all", card icons */
        control: [
          "bg-control text-fg-muted shadow-control",
          "[@media(hover:hover)]:hover:bg-hover [@media(hover:hover)]:hover:text-fg",
          "[@media(hover:hover)]:hover:[&_[data-icon]]:text-icon-hover",
          "active:bg-pressed active:shadow-control-pressed",
          "aria-expanded:bg-hover data-popup-open:bg-hover",
        ].join(" "),
        /** Raised control with inner white edge + glow — date range, sidebar toggle */
        raised: [
          "bg-control text-fg-muted shadow-control-raised",
          "border border-(--highlight-edge)",
          "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-inner-glow",
          "[@media(hover:hover)]:hover:bg-hover [@media(hover:hover)]:hover:[&_[data-icon]]:text-icon-hover",
          "active:bg-pressed",
          "aria-expanded:bg-hover data-popup-open:bg-hover",
        ].join(" "),
        /** Transparent row — sidebar nav items */
        ghost: [
          "bg-transparent text-fg-muted",
          "[@media(hover:hover)]:hover:bg-nav-hover [@media(hover:hover)]:hover:text-fg",
          "active:bg-nav-hover",
        ].join(" "),
        /** shadcn defaults kept for completeness (popovers, calendar) */
        default: "bg-primary text-primary-foreground [@media(hover:hover)]:hover:bg-primary/90 active:bg-primary/85",
        outline:
          "bg-control text-fg shadow-control [@media(hover:hover)]:hover:bg-hover active:bg-pressed",
        secondary: "bg-secondary text-secondary-foreground [@media(hover:hover)]:hover:bg-hover active:bg-pressed",
        destructive: "bg-negative/10 text-negative [@media(hover:hover)]:hover:bg-negative/15",
        link: "text-fg-accent underline-offset-4 [@media(hover:hover)]:hover:underline",
      },
      size: {
        /** 30px tall, p-8 — Download, View all */
        default: "h-[30px] gap-1.5 rounded-lg p-2",
        /** 30×30 square icon button */
        icon: "size-[30px] rounded-lg p-2",
        /** 26×26 rounded-8 icon button (KPI cards) */
        "icon-sm": "size-[26px] rounded-md p-1.5",
        /** 30px tall, px-10 — date range */
        field: "h-[30px] gap-1.5 rounded-lg px-2.5 py-1.5",
        sm: "h-7 gap-1 rounded-md px-2.5 text-xs",
        xs: "h-6 gap-1 rounded-md px-2 text-xs",
        lg: "h-9 gap-1.5 rounded-lg px-3",
        "icon-xs": "size-6 rounded-md",
        "icon-lg": "size-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "control",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "control",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
