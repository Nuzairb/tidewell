"use client"

import { toast } from "sonner"
import { SettingRow } from "@/components/settings/setting-row"
import { SettingsCard } from "@/components/settings/settings-card"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { PASSWORD_CHANGED, TWO_FACTOR, type Session, type SettingsSection } from "@/lib/data/settings"
import { notInPrototype } from "@/lib/prototype"

const ROW_BUTTON = "h-[26px] rounded-md px-2"

/**
 * Two-factor, password, and every device that's signed in. Sign-outs apply at once
 * (no Save needed); the list lives in the view so a search can't bring sessions back.
 */
export function SecuritySection({
  section,
  delay,
  sessions,
  onSessionsChange,
  show,
}: {
  section: SettingsSection
  delay: number
  sessions: Session[]
  onSessionsChange: (sessions: Session[]) => void
  show: (rowId: string) => boolean
}) {
  const others = sessions.filter((s) => !s.current)

  const signOut = (session: Session) => {
    onSessionsChange(sessions.filter((s) => s.id !== session.id))
    toast(`Signed out of ${session.device}`)
  }

  const signOutOthers = () => {
    onSessionsChange(sessions.filter((s) => s.current))
    toast(`Signed out of ${others.length} other ${others.length === 1 ? "session" : "sessions"}`)
  }

  return (
    <SettingsCard section={section} delay={delay}>
      {(show("twoFactor") || show("password")) && (
        <div className="flex flex-col border-t border-line">
          {show("twoFactor") && (
            <SettingRow
              id="two-factor"
              label="Two-factor authentication"
              description={`${TWO_FACTOR.method} · on since ${TWO_FACTOR.since}`}
            >
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-sm font-medium text-positive">
                  <span aria-hidden className="size-2 rounded-full bg-positive" />
                  On
                </span>
                <Button className={ROW_BUTTON} onClick={() => notInPrototype("Two-factor settings")}>
                  Manage
                </Button>
              </span>
            </SettingRow>
          )}
          {show("password") && (
            <SettingRow id="password" label="Password" description={`Last changed ${PASSWORD_CHANGED}`}>
              <Button className={ROW_BUTTON} onClick={() => notInPrototype("Changing your password")}>
                Change password
              </Button>
            </SettingRow>
          )}
        </div>
      )}

      {show("sessions") && (
        <div role="group" aria-labelledby="sessions-title">
          <div className="flex h-9 items-center justify-between gap-3 border-y border-line bg-sunken px-4">
            <span id="sessions-title" className="text-sm font-medium text-fg-subtle">
              Active sessions
            </span>
            <span className="text-sm font-medium text-fg-muted tabular-nums">{sessions.length}</span>
          </div>
          <ul className="flex flex-col">
            {sessions.map((session) => (
              <SessionRow key={session.id} session={session} onSignOut={() => signOut(session)} />
            ))}
          </ul>
          {others.length > 0 && (
            <div className="flex h-[45px] items-center justify-end border-t border-line px-4">
              <Button className={ROW_BUTTON} onClick={signOutOthers}>
                Sign out of all other sessions
              </Button>
            </div>
          )}
        </div>
      )}
    </SettingsCard>
  )
}

function SessionRow({ session, onSignOut }: { session: Session; onSignOut: () => void }) {
  const { device, detail, lastActive, current } = session
  return (
    <li className="flex h-[60px] items-center gap-3 border-b border-line px-4 last:border-b-0">
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-md bg-control shadow-control"
      >
        <Icon name="monitor-04" className={current ? "text-icon-accent" : undefined} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium text-fg">{device}</span>
          {current && <span className="shrink-0 text-xs font-medium text-fg-accent">This device</span>}
        </span>
        <span className="truncate text-xs font-medium text-fg-muted">
          {detail} · {lastActive}
        </span>
      </span>
      {!current && (
        <Button className={ROW_BUTTON} onClick={onSignOut} aria-label={`Sign out of ${device}`}>
          Sign out
        </Button>
      )}
    </li>
  )
}
