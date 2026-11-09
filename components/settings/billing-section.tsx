"use client"

import { CardAction } from "@/components/dashboard/card-action"
import { SettingsCard } from "@/components/settings/settings-card"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { INVOICES, PAYMENT_METHOD, PLAN, type Invoice, type SettingsSection } from "@/lib/data/settings"
import { formatDate, formatUsd, parseIsoDate } from "@/lib/format"
import { notInPrototype } from "@/lib/prototype"

const ROW_BUTTON = "h-[26px] rounded-md px-2"

/** Current plan, how it's paid, and past invoices. */
export function BillingSection({
  section,
  delay,
  show,
}: {
  section: SettingsSection
  delay: number
  show: (rowId: string) => boolean
}) {
  return (
    <SettingsCard
      section={section}
      delay={delay}
      action={<CardAction label="Change plan" feature="Changing plans" />}
    >
      {show("plan") && (
        <>
          <div className="flex flex-col gap-2.5 px-4 pb-5">
            <p className="text-sm font-medium tracking-label text-fg-muted">Current plan</p>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <span className="font-mono text-xl font-semibold text-fg-numeric tabular-nums sm:text-2xl">
                {formatUsd(PLAN.price)}
              </span>
              <span className="text-sm font-medium tracking-label text-fg-muted">
                per {PLAN.interval} · <span className="text-fg">{PLAN.name}</span>
              </span>
            </p>
            <p className="text-xs font-medium text-fg-muted">{PLAN.features}</p>
          </div>
          <dl className="flex flex-col border-t border-line">
            <div className="flex h-[45px] items-center justify-between gap-3 px-4">
              <dt className="text-sm font-medium text-fg-muted">Renews on</dt>
              <dd className="text-sm font-medium text-fg tabular-nums">{formatDate(parseIsoDate(PLAN.renews))}</dd>
            </div>
          </dl>
        </>
      )}

      {show("payment") && (
        <div className="flex h-[60px] items-center gap-3 border-t border-line px-4">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-md bg-control shadow-control"
          >
            <Icon name="credit-card-down" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="truncate text-sm font-medium text-fg">
              {PAYMENT_METHOD.brand} ending {PAYMENT_METHOD.mask}
            </span>
            <span className="truncate text-xs font-medium text-fg-muted tabular-nums">
              Payment method · expires {PAYMENT_METHOD.expires}
            </span>
          </span>
          <Button className={ROW_BUTTON} onClick={() => notInPrototype("Updating your payment method")}>
            Update
          </Button>
        </div>
      )}

      {show("invoices") && (
        <div role="group" aria-labelledby="invoices-title">
          <div className="flex h-9 items-center justify-between gap-3 border-y border-line bg-sunken px-4">
            <span id="invoices-title" className="text-sm font-medium text-fg-subtle">
              Invoices
            </span>
          </div>
          <ul className="flex flex-col">
            {INVOICES.map((invoice) => (
              <InvoiceRow key={invoice.id} invoice={invoice} />
            ))}
          </ul>
        </div>
      )}

      {show("plan") && (
        <div className="mt-auto flex h-[45px] items-center justify-between gap-3 border-t border-line bg-sunken px-4">
          <span className="truncate text-sm font-medium text-fg-muted">Plus stays active until the period ends</span>
          <Button
            variant="destructive"
            className={ROW_BUTTON}
            onClick={() => notInPrototype("Cancelling your plan")}
          >
            Cancel plan
          </Button>
        </div>
      )}
    </SettingsCard>
  )
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const date = formatDate(parseIsoDate(invoice.date))
  return (
    <li className="flex h-[45px] items-center gap-3 border-b border-line px-4 last:border-b-0">
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-fg tabular-nums">{date}</span>
      <span className="hidden text-sm font-medium text-fg-muted sm:inline">Paid</span>
      <span className="w-16 text-right text-sm font-medium text-fg tabular-nums">{formatUsd(invoice.amount)}</span>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              size="icon-sm"
              aria-label={`Download invoice for ${date}`}
              onClick={() => notInPrototype("Invoice downloads")}
            />
          }
        >
          <Icon name="download-01-alt" />
        </TooltipTrigger>
        <TooltipContent side="left">Download PDF</TooltipContent>
      </Tooltip>
    </li>
  )
}
