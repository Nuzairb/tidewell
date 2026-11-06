const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })

export const formatUsd = (n: number) => usd.format(n)

/** "+$6,200.00" / "−$86.45" (true minus sign U+2212, as in Figma) */
export const formatSignedUsd = (n: number) => `${n >= 0 ? "+" : "−"}${usd.format(Math.abs(n))}`

export const formatDate = (d: Date) => dateFmt.format(d)

export const parseIsoDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}
