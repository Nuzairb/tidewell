"use client"

import { Slider } from "@base-ui/react/slider"
import { Button } from "@/components/ui/button"
import { formatUsdWhole } from "@/lib/format"
import { cn } from "@/lib/utils"

const STEP = 25

/**
 * Monthly contribution control. Same track as Meter (6px pill, accent fill)
 * with a control-ring thumb; arrows step $25, Page Up/Down $100.
 */
export function ContributionSlider({
  value,
  planned,
  max,
  onChange,
}: {
  value: number
  /** the saved plan — "Reset" returns here */
  planned: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex h-[26px] items-center justify-between gap-3">
        <span className="text-sm font-medium text-fg">Monthly contribution</span>
        <span className="flex items-center gap-2">
          {value !== planned && (
            <Button className="h-[26px] rounded-md px-1.5" onClick={() => onChange(planned)}>
              <span className="px-[2px] leading-none font-medium">Reset</span>
            </Button>
          )}
          <span className="text-sm font-semibold text-fg-numeric tabular-nums">{formatUsdWhole(value)}</span>
        </span>
      </div>
      <Slider.Root
        value={value}
        onValueChange={(v) => onChange(v)}
        min={0}
        max={max}
        step={STEP}
        largeStep={STEP * 4}
      >
        <Slider.Control className="flex h-[26px] w-full touch-none items-center select-none">
          <Slider.Track className="relative h-1.5 w-full rounded-pill bg-pressed">
            <Slider.Indicator className="rounded-pill bg-accent-solid" />
            <Slider.Thumb
              getAriaLabel={() => "Monthly contribution"}
              getAriaValueText={(_, v) => `${formatUsdWhole(v)} a month`}
              className={cn(
                "size-4 rounded-full bg-control shadow-control outline-none",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-(--ring-focus)"
              )}
            />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
      <div className="flex justify-between text-xs font-medium text-fg-muted tabular-nums" aria-hidden>
        <span>{formatUsdWhole(0)}</span>
        <span>{formatUsdWhole(max)}</span>
      </div>
    </div>
  )
}
