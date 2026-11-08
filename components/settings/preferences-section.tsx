"use client"

import { SelectMenu } from "@/components/settings/select-menu"
import { SettingRow } from "@/components/settings/setting-row"
import { SettingsCard } from "@/components/settings/settings-card"
import {
  CURRENCIES,
  DATE_FORMATS,
  WEEK_STARTS,
  type Option,
  type SettingsSection,
  type SettingsValues,
} from "@/lib/data/settings"

type PreferenceKey = "currency" | "weekStart" | "dateFormat"

const PREFERENCES: { id: PreferenceKey; label: string; options: Option[] }[] = [
  { id: "currency", label: "Currency", options: CURRENCIES },
  { id: "weekStart", label: "Week starts on", options: WEEK_STARTS },
  { id: "dateFormat", label: "Date format", options: DATE_FORMATS },
]

/** How money and dates are shown across Tidewell. */
export function PreferencesSection({
  section,
  delay,
  values,
  show,
  onChange,
}: {
  section: SettingsSection
  delay: number
  values: SettingsValues
  show: (rowId: string) => boolean
  onChange: (patch: Partial<SettingsValues>) => void
}) {
  return (
    <SettingsCard section={section} delay={delay}>
      <div className="flex flex-col border-t border-line">
        {PREFERENCES.filter((p) => show(p.id)).map((p) => (
          <SettingRow key={p.id} id={p.id} label={p.label}>
            <SelectMenu
              label={p.label}
              value={values[p.id]}
              options={p.options}
              onChange={(value) => onChange({ [p.id]: value })}
            />
          </SettingRow>
        ))}
      </div>
    </SettingsCard>
  )
}
