const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
const usdWhole = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })

export const formatUsd = (n: number) => usd.format(n)

/** "$14,200" — goal and budget targets, where cents are noise */
export const formatUsdWhole = (n: number) => usdWhole.format(n)

/** "+$6,200.00" / "−$86.45" (true minus sign U+2212, as in Figma) */
export const formatSignedUsd = (n: number) => `${n >= 0 ? "+" : "−"}${usd.format(Math.abs(n))}`

/** Balances: no "+" on positives, true minus on debts ("−$1,284.60") */
export const formatBalance = (n: number) => (n < 0 ? `−${usd.format(-n)}` : usd.format(n))

export const formatDate = (d: Date) => dateFmt.format(d)

export const parseIsoDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}
