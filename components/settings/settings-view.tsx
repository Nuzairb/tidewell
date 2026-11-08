"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { PageContent } from "@/components/dashboard/app-shell"
import { PageHeader } from "@/components/dashboard/page-header"
import { BillingSection } from "@/components/settings/billing-section"
import { NotificationsSection } from "@/components/settings/notifications-section"
import { PreferencesSection } from "@/components/settings/preferences-section"
import { ProfileSection } from "@/components/settings/profile-section"
import { SaveBar } from "@/components/settings/save-bar"
import { SecuritySection } from "@/components/settings/security-section"
import { SettingsNav } from "@/components/settings/settings-nav"
import { useSectionScroll } from "@/components/settings/use-section-scroll"
import { Button } from "@/components/ui/button"
import {
  DEFAULT_SETTINGS,
  SESSIONS,
  SETTINGS_SECTIONS,
  type SettingsSectionId,
  type SettingsValues,
} from "@/lib/data/settings"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: SettingsValues) {
  return {
    name: values.name.trim() ? undefined : "Enter your name",
    email: EMAIL_PATTERN.test(values.email.trim()) ? undefined : "Enter a valid email address",
    threshold:
      values.notifications.largeTransactions && !(Number(values.largeThreshold) > 0)
        ? "Enter an amount above $0"
        : undefined,
  }
}

/** Which rows match the header search; a section-name match shows the whole section. */
function visibleRows(query: string) {
  const q = query.trim().toLowerCase()
  const rows = new Set<string>()
  for (const section of SETTINGS_SECTIONS) {
    const sectionMatch = section.label.toLowerCase().includes(q)
    for (const row of section.rows) {
      const text = `${row.label} ${row.keywords ?? ""}`.toLowerCase()
      if (!q || sectionMatch || text.includes(q)) rows.add(row.id)
    }
  }
  return rows
}

/** Settings — profile, preferences, notifications, security and billing. Nothing persists. */
export function SettingsView() {
  const [query, setQuery] = useState("")
  const [saved, setSaved] = useState(DEFAULT_SETTINGS)
  const [values, setValues] = useState(DEFAULT_SETTINGS)
  const [sessions, setSessions] = useState(SESSIONS)

  const rows = useMemo(() => visibleRows(query), [query])
  const sections = SETTINGS_SECTIONS.filter((s) => s.rows.some((r) => rows.has(r.id)))
  const { active, scrollTo } = useSectionScroll(sections.map((s) => s.id))

  const errors = validate(values)
  const isValid = !errors.name && !errors.email && !errors.threshold
  const isDirty = JSON.stringify(values) !== JSON.stringify(saved)

  const show = (rowId: string) => rows.has(rowId)
  const onChange = (patch: Partial<SettingsValues>) => setValues((v) => ({ ...v, ...patch }))
  const delayOf = (id: SettingsSectionId) => 40 + sections.findIndex((s) => s.id === id) * 40
  const section = (id: SettingsSectionId) => sections.find((s) => s.id === id)

  const profile = section("profile")
  const preferences = section("preferences")
  const notifications = section("notifications")
  const security = section("security")
  const billing = section("billing")

  return (
    <>
      <PageHeader
        searchLabel="Search settings"
        title="Settings"
        subtitle="Your profile, preferences and plan."
        query={query}
        onQueryChange={setQuery}
      />
      <PageContent>
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[200px_minmax(0,1fr)]">
          <SettingsNav sections={sections} active={active} onNavigate={scrollTo} />
          <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
            {profile && (
              <ProfileSection
                section={profile}
                delay={delayOf("profile")}
                values={values}
                errors={errors}
                show={show}
                onChange={onChange}
              />
            )}
            {preferences && (
              <PreferencesSection
                section={preferences}
                delay={delayOf("preferences")}
                values={values}
                show={show}
                onChange={onChange}
              />
            )}
            {notifications && (
              <NotificationsSection
                section={notifications}
                delay={delayOf("notifications")}
                values={values}
                thresholdError={errors.threshold}
                show={show}
                onChange={onChange}
              />
            )}
            {security && (
              <SecuritySection
                section={security}
                delay={delayOf("security")}
                sessions={sessions}
                onSessionsChange={setSessions}
                show={show}
              />
            )}
            {billing && <BillingSection section={billing} delay={delayOf("billing")} show={show} />}

            {!sections.length && (
              <div className="sn-enter flex flex-col items-center gap-3 rounded-card bg-surface px-4 py-10 text-center shadow-card">
                <p className="text-sm font-medium text-fg-muted">No settings match “{query.trim()}”.</p>
                <Button onClick={() => setQuery("")}>Clear search</Button>
              </div>
            )}

            {isDirty && (
              <SaveBar
                canSave={isValid}
                onDiscard={() => setValues(saved)}
                onSave={() => {
                  setSaved(values)
                  toast("Settings saved")
                }}
              />
            )}
          </div>
        </div>
      </PageContent>
    </>
  )
}
