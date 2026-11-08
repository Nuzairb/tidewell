"use client"

import { useState } from "react"
import { toast } from "sonner"
import { SectionCard } from "@/components/dashboard/section-card"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { DEFAULT_RETENTION, PRIVACY_SETTINGS, RETENTION_OPTIONS } from "@/lib/data/connections"
import { notInPrototype } from "@/lib/prototype"

const ROW = "flex min-h-[60px] items-center gap-3 border-b border-line px-4 py-3 last:border-b-0"

/** Sharing, retention and deletion. Choices live in local state only. */
export function PrivacyCard({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PRIVACY_SETTINGS.map((s) => [s.id, s.defaultOn]))
  )
  const [retention, setRetention] = useState(DEFAULT_RETENTION)
  const current = RETENTION_OPTIONS.find((o) => o.id === retention) ?? RETENTION_OPTIONS[0]

  const changeRetention = (id: string) => {
    const option = RETENTION_OPTIONS.find((o) => o.id === id)
    if (!option || id === retention) return
    setRetention(id)
    toast.success(`History kept for ${option.label}`, { description: option.description })
  }

  return (
    <SectionCard id="privacy" title="Privacy" delay={120} className={className}>
      <ul className="flex flex-col border-t border-line">
        {PRIVACY_SETTINGS.map((s) => (
          <li key={s.id} className={ROW}>
            <RowText id={`privacy-${s.id}`} label={s.label} description={s.description} />
            <Switch
              checked={enabled[s.id]}
              onCheckedChange={(checked) => setEnabled((e) => ({ ...e, [s.id]: checked }))}
              aria-labelledby={`privacy-${s.id}-label`}
              aria-describedby={`privacy-${s.id}-description`}
            />
          </li>
        ))}

        <li className={ROW}>
          <RowText id="privacy-retention" label="Keep transaction history" description={current.description} />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  className="h-[26px] rounded-md px-1.5"
                  aria-labelledby="privacy-retention-label privacy-retention-value"
                />
              }
            >
              <span id="privacy-retention-value" className="px-[2px] leading-none">
                {current.label}
              </span>
              <Icon name="chevron-selector-vertical" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={6} className="w-40">
              <DropdownMenuRadioGroup value={retention} onValueChange={changeRetention}>
                {RETENTION_OPTIONS.map((o) => (
                  <DropdownMenuRadioItem key={o.id} value={o.id}>
                    {o.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>

        <li className={ROW}>
          <RowText
            id="privacy-delete"
            label="Delete all data"
            description="Removes connections, tags and history. This can't be undone."
          />
          <Button
            variant="destructive"
            className="h-[26px] rounded-md px-1.5"
            onClick={() => notInPrototype("Deleting your data")}
          >
            <span className="px-[2px] leading-none">Delete</span>
          </Button>
        </li>
      </ul>
    </SectionCard>
  )
}

function RowText({ id, label, description }: { id: string; label: string; description: string }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span id={`${id}-label`} className="text-sm font-medium text-fg">
        {label}
      </span>
      <span id={`${id}-description`} className="text-xs leading-[1.4] font-medium text-fg-muted">
        {description}
      </span>
    </span>
  )
}
