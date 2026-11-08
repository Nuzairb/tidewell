"use client"

import Link from "next/link"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { notInPrototype } from "@/lib/prototype"

/**
 * "View all ›" control in a card's title row — same anatomy as Recent transactions.
 * Pass `href` for screens that exist, `feature` for ones that don't yet.
 */
export function CardAction({ label, ...target }: { label: string } & ({ href: string } | { feature: string })) {
  const content = (
    <span className="flex items-center gap-1">
      <span className="px-[2px] leading-none font-medium">{label}</span>
      <Icon name="chevron-right" />
    </span>
  )

  if ("href" in target) {
    return (
      <Button className="rounded-md" nativeButton={false} render={<Link href={target.href} />}>
        {content}
      </Button>
    )
  }
  return (
    <Button className="rounded-md" onClick={() => notInPrototype(target.feature)}>
      {content}
    </Button>
  )
}
