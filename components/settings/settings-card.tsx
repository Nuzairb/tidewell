import type { ReactNode } from "react"
import { SectionCard } from "@/components/dashboard/section-card"
import type { SettingsSection } from "@/lib/data/settings"

/**
 * A settings section. The wrapper carries the hash-link id (#billing …) because
 * SectionCard doesn't forward one; scroll-margin matches PageContent's padding.
 */
export function SettingsCard({
  section,
  delay,
  action,
  children,
}: {
  section: SettingsSection
  delay: number
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <div id={section.id} className="scroll-mt-4 md:scroll-mt-6">
      <SectionCard id={`settings-${section.id}`} title={section.label} action={action} delay={delay}>
        {children}
      </SectionCard>
    </div>
  )
}
