"use client"

import { useCallback, useEffect, useState } from "react"

/** A section counts as current once its top passes this far below the scroller's top edge. */
const SPY_OFFSET = 96

function scrollParent(el: HTMLElement): HTMLElement | undefined {
  for (let node = el.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node)
    if (overflowY === "auto" || overflowY === "scroll") return node
  }
}

/**
 * Hash links + scroll spy for sections that live inside PageContent's own
 * scroller (not the window).
 *
 * - On mount, and on `hashchange`, the section named in the URL hash is
 *   scrolled into view. Browsers and the Next router usually do this already;
 *   repeating it after layout settles makes /settings#billing reliable on a
 *   cold load as well as on client navigation.
 * - `active` follows scrolling. The last section may be too short to reach the
 *   top, so reaching the bottom of the scroller selects it.
 */
export function useSectionScroll(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  const key = ids.join(" ")

  useEffect(() => {
    const sectionIds = key.split(" ")
    const first = document.getElementById(sectionIds[0])
    const scroller = first && scrollParent(first)
    if (!scroller) return

    const update = () => {
      const top = scroller.getBoundingClientRect().top
      const atBottom =
        scroller.scrollTop > 0 && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2
      let current = sectionIds[0]
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top - top <= SPY_OFFSET) current = id
      }
      setActive(atBottom ? sectionIds[sectionIds.length - 1] : current)
    }

    update()
    scroller.addEventListener("scroll", update, { passive: true })
    return () => scroller.removeEventListener("scroll", update)
  }, [key])

  useEffect(() => {
    const scrollToHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      const el = id ? document.getElementById(id) : null
      if (!el) return
      el.scrollIntoView({ block: "start" })
      setActive(id)
    }
    // wait one frame so fonts and media-query layout have settled
    const frame = requestAnimationFrame(scrollToHash)
    window.addEventListener("hashchange", scrollToHash)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("hashchange", scrollToHash)
    }
  }, [])

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ block: "start" })
    // keep the URL shareable without adding a history entry per click
    window.history.replaceState(window.history.state, "", `#${id}`)
    setActive(id)
  }, [])

  return { active, scrollTo }
}
