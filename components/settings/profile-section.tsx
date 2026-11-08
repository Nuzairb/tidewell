"use client"

import { SettingRow } from "@/components/settings/setting-row"
import { SettingsCard } from "@/components/settings/settings-card"
import { TextField } from "@/components/settings/text-field"
import { CardAction } from "@/components/dashboard/card-action"
import type { SettingsSection, SettingsValues } from "@/lib/data/settings"

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")

/** Avatar, name and email. The tile and summary update as you type. */
export function ProfileSection({
  section,
  delay,
  values,
  errors,
  show,
  onChange,
}: {
  section: SettingsSection
  delay: number
  values: SettingsValues
  errors: Partial<Record<"name" | "email", string>>
  show: (rowId: string) => boolean
  onChange: (patch: Partial<SettingsValues>) => void
}) {
  return (
    <SettingsCard
      section={section}
      delay={delay}
      action={<CardAction label="Change photo" feature="Profile photos" />}
    >
      <div className="flex items-center gap-3 px-4 pb-5">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-md bg-avatar shadow-avatar"
        >
          <span className="font-avatar text-base leading-none font-semibold tracking-[-0.015em] text-fg-accent">
            {initialsOf(values.name) || "?"}
          </span>
        </span>
        <span className="flex min-w-0 flex-col gap-1.5">
          <span className="truncate text-sm font-medium tracking-label text-fg">{values.name || "Your name"}</span>
          <span className="truncate text-xs font-medium text-fg-muted">{values.email}</span>
        </span>
      </div>

      <div className="flex flex-col border-t border-line">
        {show("name") && (
          <SettingRow id="name" label="Full name" htmlFor="settings-name" error={errors.name}>
            <TextField
              id="settings-name"
              autoComplete="name"
              value={values.name}
              onChange={(e) => onChange({ name: e.target.value })}
              aria-invalid={!!errors.name || undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="w-full sm:w-72"
            />
          </SettingRow>
        )}
        {show("email") && (
          <SettingRow id="email" label="Email address" htmlFor="settings-email" error={errors.email}>
            <TextField
              id="settings-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={values.email}
              onChange={(e) => onChange({ email: e.target.value })}
              aria-invalid={!!errors.email || undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="w-full sm:w-72"
            />
          </SettingRow>
        )}
      </div>
    </SettingsCard>
  )
}
