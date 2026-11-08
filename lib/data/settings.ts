import { USER, type IconName } from "./nav"

/**
 * Settings: the signed-in user's preferences, sessions and plan.
 * Static prototype data — there is NO backend; nothing is persisted.
 */

export type SettingsSectionId = "profile" | "preferences" | "notifications" | "security" | "billing"

export type SettingsSection = {
  id: SettingsSectionId
  label: string
  icon: IconName
  /** rows in this section, matched by the header search on label + keywords */
  rows: { id: string; label: string; keywords?: string }[]
}

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: "profile",
    label: "Profile",
    icon: "user-circle",
    rows: [
      { id: "name", label: "Full name", keywords: "account avatar" },
      { id: "email", label: "Email address", keywords: "account login" },
    ],
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: "settings-01",
    rows: [
      { id: "currency", label: "Currency", keywords: "money dollar euro" },
      { id: "weekStart", label: "Week starts on", keywords: "calendar sunday monday" },
      { id: "dateFormat", label: "Date format", keywords: "calendar" },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: "bell-01",
    rows: [
      { id: "budgetAlerts", label: "Budget alerts", keywords: "email push" },
      { id: "billReminders", label: "Bill reminders", keywords: "recurring email push" },
      { id: "weeklySummary", label: "Weekly summary", keywords: "email recap digest" },
      { id: "largeTransactions", label: "Large transaction alerts", keywords: "threshold amount" },
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: "file-shield-01",
    rows: [
      { id: "twoFactor", label: "Two-factor authentication", keywords: "2fa mfa" },
      { id: "password", label: "Password", keywords: "login" },
      { id: "sessions", label: "Active sessions", keywords: "devices sign out" },
    ],
  },
  {
    id: "billing",
    label: "Plan & billing",
    icon: "credit-card-down",
    rows: [
      { id: "plan", label: "Current plan", keywords: "subscription plus cancel" },
      { id: "payment", label: "Payment method", keywords: "card visa" },
      { id: "invoices", label: "Invoices", keywords: "receipts download" },
    ],
  },
]

export type Option = { value: string; label: string }

export const CURRENCIES: Option[] = [
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "CAD", label: "Canadian Dollar (CAD)" },
  { value: "AUD", label: "Australian Dollar (AUD)" },
]

export const WEEK_STARTS: Option[] = [
  { value: "sunday", label: "Sunday" },
  { value: "monday", label: "Monday" },
]

export const DATE_FORMATS: Option[] = [
  { value: "mdy", label: "Sep 30, 2026" },
  { value: "dmy", label: "30 Sep 2026" },
  { value: "iso", label: "2026-09-30" },
]

export type NotificationKey = "budgetAlerts" | "billReminders" | "weeklySummary" | "largeTransactions"

export const NOTIFICATION_OPTIONS: { id: NotificationKey; label: string; description: string }[] = [
  { id: "budgetAlerts", label: "Budget alerts", description: "When a category reaches 85% of its limit" },
  { id: "billReminders", label: "Bill reminders", description: "Two days before a recurring charge" },
  { id: "weeklySummary", label: "Weekly summary", description: "Spending and income recap every week" },
  { id: "largeTransactions", label: "Large transaction alerts", description: "Any single charge over your threshold" },
]

export type SettingsValues = {
  name: string
  email: string
  currency: string
  weekStart: string
  dateFormat: string
  notifications: Record<NotificationKey, boolean>
  /** dollars, kept as typed so the field can be edited freely */
  largeThreshold: string
}

export const DEFAULT_SETTINGS: SettingsValues = {
  name: USER.name,
  email: USER.email,
  currency: "USD",
  weekStart: "monday",
  dateFormat: "mdy",
  notifications: { budgetAlerts: true, billReminders: true, weeklySummary: false, largeTransactions: true },
  largeThreshold: "500",
}

export const TWO_FACTOR = { enabled: true, method: "Authenticator app", since: "Mar 2026" }
export const PASSWORD_CHANGED = "4 months ago"

export type Session = { id: string; device: string; detail: string; lastActive: string; current?: boolean }

export const SESSIONS: Session[] = [
  { id: "s1", device: "MacBook Pro", detail: "Chrome · Lisbon, Portugal", lastActive: "Active now", current: true },
  { id: "s2", device: "iPhone 16", detail: "Tidewell for iOS · Lisbon, Portugal", lastActive: "2 hours ago" },
  { id: "s3", device: "iPad Air", detail: "Safari · Porto, Portugal", lastActive: "Sep 21, 2026" },
  { id: "s4", device: "Windows PC", detail: "Edge · Madrid, Spain", lastActive: "Sep 2, 2026" },
]

export const PLAN = {
  name: "Tidewell Plus",
  price: 8,
  interval: "month",
  renews: "2026-10-14",
  features: "Unlimited accounts · CSV export · Priority support",
}

export const PAYMENT_METHOD = { brand: "Visa", mask: "4242", expires: "08/28" }

export type Invoice = { id: string; date: string; amount: number }

export const INVOICES: Invoice[] = [
  { id: "inv-0926", date: "2026-09-14", amount: 8 },
  { id: "inv-0826", date: "2026-08-14", amount: 8 },
  { id: "inv-0726", date: "2026-07-14", amount: 8 },
  { id: "inv-0626", date: "2026-06-14", amount: 8 },
]
