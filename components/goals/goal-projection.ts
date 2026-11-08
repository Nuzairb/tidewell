import { TODAY } from "@/lib/data"
import { formatUsdWhole } from "@/lib/format"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** Months counted from year 0, so "Jun 2027" and TODAY can be subtracted. */
const CURRENT = TODAY.getFullYear() * 12 + TODAY.getMonth()

const parseMonth = (label: string) => {
  const [month, year] = label.split(" ")
  return Number(year) * 12 + MONTHS.indexOf(month)
}

export const formatMonth = (index: number) => `${MONTHS[index % 12]} ${Math.floor(index / 12)}`

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`

export type Projection = {
  onTrack: boolean
  /** "Mar 2027", or undefined when nothing is going in */
  finish?: string
  /** monthly amount that lands exactly on the due month */
  needed: number
  sentence: string
}

/** When a goal is reached at a given monthly contribution, and how that compares to its due date. */
export function projectGoal(goal: { saved: number; target: number; due: string }, monthly: number): Projection {
  const remaining = Math.max(goal.target - goal.saved, 0)
  const due = parseMonth(goal.due)
  const needed = Math.ceil(remaining / Math.max(due - CURRENT, 1))

  if (remaining === 0) return { onTrack: true, finish: formatMonth(CURRENT), needed: 0, sentence: "Goal reached." }
  if (monthly <= 0) {
    return {
      onTrack: false,
      needed,
      sentence: `With nothing going in, you won't get there. ${formatUsdWhole(needed)} a month reaches it by ${goal.due}.`,
    }
  }

  const finish = CURRENT + Math.ceil(remaining / monthly)
  const diff = due - finish
  const timing =
    diff === 0 ? "right on time" : diff > 0 ? `${plural(diff, "month")} early` : `${plural(-diff, "month")} late`

  return {
    onTrack: diff >= 0,
    finish: formatMonth(finish),
    needed,
    sentence: `At ${formatUsdWhole(monthly)} a month you'll get there in ${formatMonth(finish)} — ${timing}.`,
  }
}
