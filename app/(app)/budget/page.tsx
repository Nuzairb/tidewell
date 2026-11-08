import type { Metadata } from "next"
import { BudgetView } from "@/components/budget/budget-view"

export const metadata: Metadata = { title: "Budget" }

export default function BudgetPage() {
  return <BudgetView />
}
