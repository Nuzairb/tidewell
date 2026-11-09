"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: ReactNode }) {
  return (
    // Light by default so the first paint matches Figma; the sidebar toggle switches theme.
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      {/* First tooltip waits 400ms; neighbours open instantly (Base UI provider). */}
      <TooltipProvider delay={400} closeDelay={0}>
        {children}
        <Toaster position="bottom-right" />
      </TooltipProvider>
    </ThemeProvider>
  )
}
