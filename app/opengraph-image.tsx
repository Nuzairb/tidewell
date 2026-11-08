import { ImageResponse } from "next/og"
import { GEIST_SEMIBOLD, Lockup } from "@/lib/brand-image"

export const alt = "Tidewell"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/** Open Graph card: the full Tidewell logo on a plain white background. */
export default function OpengraphImage() {
  // Same 24 : 18 mark-to-wordmark ratio and 10px gap as the sidebar brand row, scaled ×6.
  return new ImageResponse(<Lockup mark={144} text={108} gap={60} />, {
    ...size,
    fonts: [{ name: "Geist", data: GEIST_SEMIBOLD, weight: 600, style: "normal" }],
  })
}
