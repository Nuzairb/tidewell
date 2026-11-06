import { ImageResponse } from "next/og"
import { LOGO_SRC } from "@/lib/brand-image"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

/** iOS home-screen icon: the logo mark on white (iOS applies its own corner mask). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
        }}
      >
        <img src={LOGO_SRC} width={112} height={112} alt="" />
      </div>
    ),
    size
  )
}
