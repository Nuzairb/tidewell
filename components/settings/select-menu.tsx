"use client"

import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Option } from "@/lib/data/settings"

/** A 26px in-card control that opens a single-choice menu. */
export function SelectMenu({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: Option[]
  onChange: (value: string) => void
}) {
  const selected = options.find((o) => o.value === value) ?? options[0]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button className="h-[26px] gap-1 rounded-md px-2" aria-label={`${label}: ${selected.label}`} />}
      >
        <span className="px-[2px] leading-none font-medium tabular-nums">{selected.label}</span>
        <Icon name="chevron-selector-vertical" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-auto min-w-44">
        <DropdownMenuRadioGroup value={value} onValueChange={(v: string) => onChange(v)}>
          {options.map((o) => (
            <DropdownMenuRadioItem key={o.value} value={o.value} className="h-[30px] tabular-nums">
              {o.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
