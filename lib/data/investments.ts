/**
 * The Vanguard Index Portfolio (account a3): funds, targets and the figures
 * needed to derive this year's gain. Static prototype data — there is NO backend.
 */

export const PORTFOLIO_ACCOUNT_ID = "a3"

/** Value on Jan 1 — with contributions, gives the +8.4% return in a3's facts. */
export const PORTFOLIO_START_OF_YEAR = 38644.58

/** Auto-invested on the 15th (see ACCOUNT_ACTIVITY). */
export const MONTHLY_CONTRIBUTION = 1000

export type Holding = {
  ticker: string
  name: string
  assetClass: string
  /** market value; holdings sum to the a3 balance ($51,268.73) */
  value: number
  price: number
  /** share of the portfolio the plan aims for, 0–1 */
  target: number
  /** return this year, % */
  returnYtd: number
  dividendsYtd: number
}

export const HOLDINGS: Holding[] = [
  {
    ticker: "VTSAX",
    name: "Total Stock Market Index",
    assetClass: "US stocks",
    value: 31894.52,
    price: 142.86,
    target: 0.6,
    returnYtd: 11.1,
    // includes the Sep 29 dividend in ACCOUNT_ACTIVITY ($212.38)
    dividendsYtd: 616.46,
  },
  {
    ticker: "VTIAX",
    name: "Total International Stock Index",
    assetClass: "International stocks",
    value: 9742.18,
    price: 35.21,
    target: 0.2,
    returnYtd: 6.8,
    dividendsYtd: 168.2,
  },
  {
    ticker: "VBTLX",
    name: "Total Bond Market Index",
    assetClass: "Bonds",
    value: 7121.4,
    price: 9.74,
    target: 0.15,
    returnYtd: 2.1,
    dividendsYtd: 181.94,
  },
  {
    ticker: "VGSLX",
    name: "Real Estate Index",
    assetClass: "Real estate",
    value: 2510.63,
    price: 128.4,
    target: 0.05,
    returnYtd: -1.4,
    dividendsYtd: 64.37,
  },
]
