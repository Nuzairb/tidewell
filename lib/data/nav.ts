/**
 * Navigation, the signed-in user, notifications and shortcuts.
 * Static prototype data — there is NO backend.
 */

export type IconName =
  | "home-line"
  | "user-circle"
  | "coins-swap-01"
  | "bar-chart-circle-01"
  | "pie-chart-01"
  | "layers-three-01"
  | "wallet-02"
  | "calendar"
  | "target-05"
  | "bar-chart-11"
  | "monitor-04"
  | "file-03"
  | "file-shield-01"
  | "message-question-square"
  | "moon-02"
  | "settings-01"
  | "search-lg"
  | "help-circle"
  | "bell-01"
  | "chevron-down"
  | "chevron-right"
  | "chevron-selector-vertical"
  | "download-01-alt"
  | "credit-card-down"
  | "minus-circle"
  | "line-chart-up-05"
  | "align-left-01"

/** `href` marks the screens that exist; anything without one shows a "coming soon" toast. */
export type NavLink = { id: string; label: string; icon: IconName; href?: string }
export type NavGroup = NavLink & { children?: NavLink[] }

export const PRIMARY_NAV: NavLink[] = [
  { id: "home", label: "Home", icon: "home-line", href: "/" },
  { id: "accounts", label: "Accounts", icon: "user-circle", href: "/accounts" },
  { id: "transactions", label: "Transactions", icon: "coins-swap-01", href: "/transactions" },
  { id: "cashflow", label: "Cashflow", icon: "bar-chart-circle-01", href: "/cashflow" },
  { id: "reports", label: "Reports", icon: "pie-chart-01", href: "/reports" },
]

export const HELP_NAV: NavLink = { id: "help", label: "Help & Support", icon: "message-question-square", href: "/help" }
export const SETTINGS_NAV: NavLink = { id: "settings", label: "Setting", icon: "settings-01", href: "/settings" }

export const SECONDARY_NAV: NavGroup[] = [
  {
    id: "planning",
    label: "Planning",
    icon: "layers-three-01",
    children: [
      { id: "budget", label: "Budget", icon: "wallet-02", href: "/budget" },
      { id: "recurring", label: "Recurring", icon: "calendar", href: "/recurring" },
      { id: "goals", label: "Goals", icon: "target-05", href: "/goals" },
      { id: "investments", label: "Investments", icon: "bar-chart-11", href: "/investments" },
    ],
  },
  { id: "analytics", label: "Analytics", icon: "monitor-04", href: "/analytics" },
  { id: "tracking", label: "Tracking", icon: "file-03", href: "/tracking" },
  { id: "data", label: "Data", icon: "file-shield-01", href: "/data" },
]

export const USER = { name: "Liam Jonas", email: "liamjonas@gmail.com", initials: "LJ" }

export const NOTIFICATIONS = [
  { id: "n1", title: "Salary received", body: "+$6,200.00 landed in Checking.", time: "2h ago" },
  { id: "n2", title: "Budget alert", body: "Food & Dining is at 86% of September budget.", time: "1d ago" },
  { id: "n3", title: "Netflix renews soon", body: "$15.49 will be charged on Oct 24.", time: "3d ago" },
]

export const SHORTCUTS = [
  { keys: ["/"], label: "Focus search" },
  { keys: ["⌘", "B"], label: "Toggle sidebar" },
  { keys: ["←", "→"], label: "Step through chart (when focused)" },
  { keys: ["Esc"], label: "Clear search / close popovers" },
]
