import { ACCOUNTS, TODAY } from "@/lib/data"
import {
  HOLDINGS,
  MONTHLY_CONTRIBUTION,
  PORTFOLIO_ACCOUNT_ID,
  PORTFOLIO_START_OF_YEAR,
  type Holding,
} from "@/lib/data/investments"

/** Every figure on Investments, derived from the a3 account and its holdings. */

export const ACCOUNT = ACCOUNTS.find((a) => a.id === PORTFOLIO_ACCOUNT_ID)!

export type HoldingRow = Holding & {
  /** position in HOLDINGS — fixes the fund's series colour even when filtered */
  index: number
  shares: number
  /** actual share of the portfolio, 0–1 */
  weight: number
}

const total = HOLDINGS.reduce((sum, h) => sum + h.value, 0)

export const HOLDING_ROWS: HoldingRow[] = HOLDINGS.map((h, index) => ({
  ...h,
  index,
  shares: h.value / h.price,
  weight: h.value / total,
}))

// one contribution a month, January through the current month
const contributions = MONTHLY_CONTRIBUTION * (TODAY.getMonth() + 1)
const gain = ACCOUNT.balance - PORTFOLIO_START_OF_YEAR - contributions

export const PORTFOLIO = {
  value: ACCOUNT.balance,
  startOfYear: PORTFOLIO_START_OF_YEAR,
  contributions,
  gain,
  // simple Dietz: contributions spread evenly, so on average half the year invested
  returnPct: (gain / (PORTFOLIO_START_OF_YEAR + contributions / 2)) * 100,
  dividends: HOLDINGS.reduce((sum, h) => sum + h.dividendsYtd, 0),
}

export const formatPct = (n: number) => `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(1)}%`

export const formatShare = (n: number) => `${(n * 100).toFixed(1)}%`
