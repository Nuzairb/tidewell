import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * One settings row in the table grammar: 45px label/value, 60px with a description.
 * Pass `htmlFor` when the control is a native input; otherwise point the control's
 * aria-labelledby / aria-describedby at `${id}-label` / `${id}-description` (or `${id}-error`).
 */
export function SettingRow({
  id,
  label,
  description,
  error,
  htmlFor,
  children,
  className,
}: {
  id: string
  label: string
  description?: ReactNode
  /** replaces the description while the value is invalid */
  error?: string
  htmlFor?: string
  children: ReactNode
  className?: string
}) {
  const Label = htmlFor ? "label" : "span"
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 last:border-b-0",
        description || error ? "min-h-[60px] py-2.5" : "min-h-[45px] py-2",
        className
      )}
    >
      <span className="flex min-w-0 flex-col gap-1.5">
        <Label id={`${id}-label`} htmlFor={htmlFor} className="text-sm font-medium text-fg">
          {label}
        </Label>
        {error ? (
          <span id={`${id}-error`} className="text-xs leading-[1.3] font-medium text-negative">
            {error}
          </span>
        ) : (
          description && (
            <span id={`${id}-description`} className="text-xs leading-[1.3] font-medium text-fg-muted">
              {description}
            </span>
          )
        )}
      </span>
      {children}
    </div>
  )
}
