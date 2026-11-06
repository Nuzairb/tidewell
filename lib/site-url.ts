/** Canonical public URL of the live prototype. */
export const PRODUCTION_URL = "https://statsnap-kargul.vercel.app"

/**
 * Public origin of the site, used as `metadataBase` so Open Graph / Twitter
 * image tags are absolute URLs that link-preview crawlers can actually fetch.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL (or SITE_URL)  — override, e.g. after adding a custom domain
 *  2. Vercel production → PRODUCTION_URL  — NOT `VERCEL_PROJECT_PRODUCTION_URL`: on this
 *     project that resolves to statsnap-eight.vercel.app, which 404s, so every
 *     preview card broke
 *  3. Vercel preview    → the deployment's own URL (VERCEL_BRANCH_URL / VERCEL_URL)
 *  4. Any other production build → PRODUCTION_URL
 *  5. `next dev`        → http://localhost:$PORT (crawlers can't reach this; expected)
 */
export function getSiteUrl(): URL {
  const withProtocol = (host: string) => (/^https?:\/\//.test(host) ? host : `https://${host}`)

  const explicit = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL
  if (explicit) return new URL(withProtocol(explicit))

  if (process.env.VERCEL_ENV === "production") return new URL(PRODUCTION_URL)

  const deployment = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL
  if (deployment) return new URL(withProtocol(deployment))

  if (process.env.NODE_ENV === "production") return new URL(PRODUCTION_URL)

  return new URL(`http://localhost:${process.env.PORT || 3000}`)
}
