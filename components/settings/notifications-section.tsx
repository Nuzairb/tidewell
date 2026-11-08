"use client"

import { SettingRow } from "@/components/settings/setting-row"
import { SettingsCard } from "@/components/settings/settings-card"
import { TextField } from "@/components/settings/text-field"
import { Switch } from "@/components/ui/switch"
import { NOTIFICATION_OPTIONS, type SettingsSection, type SettingsValues } from "@/lib/data/settings"

/** What Tidewell tells you about, plus the amount that counts as a large charge. */
export function NotificationsSection({
  section,
  delay,
  values,
  thresholdError,
  show,
  onChange,
}: {
  section: SettingsSection
  delay: number
  values: SettingsValues
  thresholdError?: string
  show: (rowId: string) => boolean
  onChange: (patch: Partial<SettingsValues>) => void
}) {
  const { notifications } = values

  return (
    <SettingsCard section={section} delay={delay}>
      <div className="flex flex-col border-t border-line">
        {NOTIFICATION_OPTIONS.filter((option) => show(option.id)).map((option) => (
          <SettingRow key={option.id} id={option.id} label={option.label} description={option.description}>
            <Switch
              checked={notifications[option.id]}
              onCheckedChange={(checked) =>
                onChange({ notifications: { ...notifications, [option.id]: checked } })
              }
              aria-labelledby={`${option.id}-label`}
              aria-describedby={`${option.id}-description`}
            />
          </SettingRow>
        ))}
        {show("largeTransactions") && (
          <SettingRow
            id="threshold"
            label="Alert me for charges over"
            htmlFor="settings-threshold"
            error={thresholdError}
            className="bg-sunken"
          >
            <span className="relative flex w-28">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-sm font-medium text-fg-muted"
              >
                $
              </span>
              <TextField
                id="settings-threshold"
                inputMode="numeric"
                value={values.largeThreshold}
                disabled={!notifications.largeTransactions}
                onChange={(e) => onChange({ largeThreshold: e.target.value.replace(/[^\d]/g, "") })}
                aria-invalid={!!thresholdError || undefined}
                aria-describedby={thresholdError ? "threshold-error" : undefined}
                className="h-[26px] rounded-md pl-5 text-right tabular-nums"
              />
            </span>
          </SettingRow>
        )}
      </div>
    </SettingsCard>
  )
}
