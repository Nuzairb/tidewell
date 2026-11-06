"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: ReactNode }) {
  return (
    // Always light (matches Figma). forcedTheme also overrides any "dark" saved earlier.
    <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
      {/* First tooltip waits 400ms; neighbours open instantly (Base UI provider). */}
      <TooltipProvider delay={400} closeDelay={0}>
        {children}
        <Toaster position="bottom-right" />
      </TooltipProvider>
    </ThemeProvider>
  )
}
