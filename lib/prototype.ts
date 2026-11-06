import { toast } from "sonner"

/**
 * Every control on the page does *something*. Controls that would navigate to
 * screens that don't exist in this design prototype explain that instead of
 * silently doing nothing.
 */
export function notInPrototype(feature: string) {
  toast(`${feature} is coming soon`, { id: "not-in-prototype" })
}
