/**
 * One colour per fund, in HOLDINGS order, from the existing series tokens
 * (max four, per the data-vis rules). Shared by the allocation bars and the holdings rows.
 */
const FUND_SERIES = [
  { color: "var(--series-income)", ring: "var(--series-income-ring)" },
  { color: "var(--series-net)", ring: "var(--series-net-ring)" },
  { color: "var(--series-expenses)", ring: "var(--series-expenses-ring)" },
  { color: "var(--fg-subtle)", ring: "var(--fg-subtle)" },
]

export const fundColor = (index: number) => FUND_SERIES[index % FUND_SERIES.length].color

/** Legend chip — same recipe as the Cash Flow legend. */
export function FundChip({ index }: { index: number }) {
  const { color, ring } = FUND_SERIES[index % FUND_SERIES.length]
  return (
    <span
      aria-hidden
      className="relative size-2.5 shrink-0 rounded-chip border-[0.5px] border-(--highlight-edge)"
      style={{ boxShadow: `var(--shadow-chip-base), 0px 0px 0px 1px ${ring}` }}
    >
      <span className="absolute inset-0 rounded-chip" style={{ background: color }} />
      <span className="absolute inset-0 rounded-[inherit] shadow-inner-glow" />
    </span>
  )
}
