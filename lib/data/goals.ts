import { GOALS, type Goal } from "./planning"

/**
 * Savings plans behind GOALS: how much goes in each month, from where, and
 * how the saved amount grew. Static prototype data — there is NO backend.
 */

export type GoalPlan = Goal & {
  /** planned monthly contribution */
  monthly: number
  /** Account id the money sits in (see ACCOUNTS) */
  account: string
  started: string
  /** month-end saved amount, Apr → Sep (last = saved), see HISTORY_MONTHS */
  history: number[]
}

const PLANS: Record<string, Omit<GoalPlan, keyof Goal>> = {
  g1: { monthly: 500, account: "a2", started: "Jan 2025", history: [11700, 12200, 12700, 13200, 13700, 14200] },
  // opened in June with a one-off $650 deposit
  g2: { monthly: 600, account: "a1", started: "Jun 2026", history: [0, 0, 650, 1250, 1850, 2450] },
  g3: { monthly: 300, account: "a1", started: "Apr 2026", history: [300, 600, 900, 1200, 1500, 1800] },
}

export const GOAL_PLANS: GoalPlan[] = GOALS.map((goal) => ({ ...goal, ...PLANS[goal.id] }))
