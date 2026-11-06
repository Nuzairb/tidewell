import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { getSiteUrl } from "@/lib/site-url"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
// Inter is only used for the avatar initials ("LJ"), exactly as in Figma.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["600"] })

const description = "Track your finances and spending habits — income, expenses and net cashflow at a glance."

/*
 * Icons are file-based (app/icon.svg, app/apple-icon.tsx), as are the social
 * cards (app/opengraph-image.tsx, app/twitter-image.tsx) and app/manifest.ts.
 */
export const metadata: Metadata = {
  // Absolute base for og:image / twitter:image / og:url — see lib/site-url.ts
  metadataBase: getSiteUrl(),
  title: {
    default: "Reports · Statsnap",
    template: "%s · Statsnap",
  },
  description,
  applicationName: "Statsnap",
  keywords: ["finance dashboard", "cashflow", "budgeting", "expenses", "income", "reports"],
  authors: [{ name: "Kargul Studio" }],
  creator: "Kargul Studio",
  // Design prototype with mock data — keep it out of search results.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: "Statsnap",
    title: "Statsnap — Reports",
    description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Statsnap — Reports",
    description,
  },
  appleWebApp: { title: "Statsnap", statusBarStyle: "default" },
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // The app opens in light mode regardless of OS setting (matches Figma), so one colour.
  themeColor: "#FFFFFF",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full`}
    >
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
