import { readFile } from "node:fs/promises"
import { join } from "node:path"

/**
 * Shared assets for generated brand images (Open Graph, Twitter, Apple touch icon).
 * Read once at module scope — they never depend on request data.
 */
const root = process.cwd()

const logoSvg = await readFile(join(root, "public/figma/logo.svg"), "base64")
export const LOGO_SRC = `data:image/svg+xml;base64,${logoSvg}`

/** Geist SemiBold — the wordmark weight used in the sidebar (Figma 1:10). */
export const GEIST_SEMIBOLD = await readFile(
  join(root, "node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf")
)

export const BRAND = {
  name: "Statsnap",
  ink: "#09090B", // --sn-neutral-950 (wordmark colour)
  blue: "#1067FF", // --sn-blue-500
  paper: "#FFFFFF",
} as const

/** The full lockup: logo mark + "Statsnap" wordmark, centred on white. */
export function Lockup({ mark, text, gap }: { mark: number; text: number; gap: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap,
        background: BRAND.paper,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_SRC} width={mark} height={mark} alt="" />
      <div
        style={{
          fontFamily: "Geist",
          fontWeight: 600,
          fontSize: text,
          letterSpacing: `${-0.02 * text}px`,
          color: BRAND.ink,
          lineHeight: 1,
        }}
      >
        {BRAND.name}
      </div>
    </div>
  )
}
