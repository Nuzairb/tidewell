import type { Metadata } from "next"
import { CashflowView } from "@/components/cashflow/cashflow-view"

export const metadata: Metadata = { title: "Cashflow" }

export default function CashflowPage() {
  return <CashflowView />
}
