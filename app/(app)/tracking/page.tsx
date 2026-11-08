import type { Metadata } from "next"
import { TrackingView } from "@/components/tracking/tracking-view"

export const metadata: Metadata = { title: "Tracking" }

export default function TrackingPage() {
  return <TrackingView />
}
