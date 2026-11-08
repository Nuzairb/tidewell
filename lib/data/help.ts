import type { IconName } from "./nav"

/**
 * Help & Support: topics, FAQ and support contacts.
 * Static prototype data — there is NO backend.
 */

export type HelpTopicId = "getting-started" | "accounts" | "budgets" | "security" | "billing"

export type HelpTopic = { id: HelpTopicId; label: string; icon: IconName; articles: number }

export const HELP_TOPICS: HelpTopic[] = [
  { id: "getting-started", label: "Getting started", icon: "home-line", articles: 8 },
  { id: "accounts", label: "Accounts & syncing", icon: "user-circle", articles: 14 },
  { id: "budgets", label: "Budgets & goals", icon: "wallet-02", articles: 11 },
  { id: "security", label: "Security & privacy", icon: "file-shield-01", articles: 6 },
  { id: "billing", label: "Billing", icon: "credit-card-down", articles: 5 },
]

export type Faq = { id: string; topic: HelpTopicId; question: string; answer: string }

export const FAQS: Faq[] = [
  {
    id: "connect-account",
    topic: "getting-started",
    question: "How do I connect my first account?",
    answer:
      "Open Accounts and choose Link account. Pick your bank, sign in on its own secure page and choose which accounts to share. Balances show up within a minute; full transaction history can take up to an hour.",
  },
  {
    id: "shortcuts",
    topic: "getting-started",
    question: "Are there keyboard shortcuts?",
    answer:
      "Yes. Press / to jump to search from anywhere, ⌘B (Ctrl B on Windows) to collapse the sidebar and Esc to clear search or close a popover. The full list is in the Keyboard shortcuts card on this page.",
  },
  {
    id: "stale-balance",
    topic: "accounts",
    question: "Why is an account balance out of date?",
    answer:
      "Most banks share new data once or twice a day, so a purchase can take a few hours to appear. If a connection needs you to sign in again, the account shows a notice in Accounts. Reconnect from there and it catches up automatically.",
  },
  {
    id: "credit-positive",
    topic: "accounts",
    question: "Why are credit card balances shown as positive?",
    answer:
      "On a card's detail panel Tidewell shows what you owe as a positive amount, so an increase is marked as a bad change. Your net worth still subtracts every card balance.",
  },
  {
    id: "categories",
    topic: "accounts",
    question: "How are transactions categorised?",
    answer:
      "Each transaction is categorised from its merchant. Change a category on any transaction and Tidewell applies it to future payments to the same merchant.",
  },
  {
    id: "budget-alerts",
    topic: "budgets",
    question: "When do budget alerts go off?",
    answer:
      "A budget category turns red once it reaches 85% of its monthly limit. With Budget alerts switched on in Settings → Notifications, you also get a notification at that point.",
  },
  {
    id: "budget-reset",
    topic: "budgets",
    question: "When does my budget reset?",
    answer:
      "Budgets run from the 1st to the last day of each calendar month, and unspent amounts don't roll over. Your “week starts on” preference only affects the weekly summary.",
  },
  {
    id: "goal-progress",
    topic: "budgets",
    question: "How is goal progress calculated?",
    answer:
      "Progress is the amount saved divided by the goal's target. Deposits into the savings account linked to a goal count toward it automatically.",
  },
  {
    id: "read-only",
    topic: "security",
    question: "Can Tidewell move money out of my accounts?",
    answer:
      "No. Tidewell only has read-only access to your accounts. We never see or store your bank sign-in details, and your data is encrypted in transit and at rest.",
  },
  {
    id: "two-factor",
    topic: "security",
    question: "How do I turn on two-factor authentication?",
    answer:
      "Go to Settings → Security and set up an authenticator app. You can also see every device that's signed in there, and sign out any session you don't recognise.",
  },
  {
    id: "plus",
    topic: "billing",
    question: "What's included in Tidewell Plus?",
    answer:
      "Unlimited linked accounts, custom budget categories, CSV export of every report and priority support, for $8 a month.",
  },
  {
    id: "cancel",
    topic: "billing",
    question: "How do I cancel or change my plan?",
    answer:
      "Open Settings → Plan & billing. You can cancel at any time and keep Plus until the end of the period you've paid for. Past invoices can be downloaded there too.",
  },
]

export const SUPPORT = {
  email: "support@tidewell.app",
  chatHours: "Mon–Fri, 9am–6pm ET",
  replyTime: "Under 4 hours",
  status: "All systems operational",
  statusCheckedAgo: "2 min ago",
}
