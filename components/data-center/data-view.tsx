"use client"

import { useState } from "react"
import { PageContent } from "@/components/dashboard/app-shell"
import { PageHeader } from "@/components/dashboard/page-header"
import { ConnectionsCard } from "@/components/data-center/connections-card"
import { ExportCard } from "@/components/data-center/export-card"
import { ImportCard } from "@/components/data-center/import-card"
import { PrivacyCard } from "@/components/data-center/privacy-card"

/** Data — what's connected, getting your data in and out, and what we keep. */
export function DataView() {
  const [query, setQuery] = useState("")

  return (
    <>
      <PageHeader
        searchLabel="Search connections"
        title="Data"
        subtitle="Connections, exports and privacy."
        query={query}
        onQueryChange={setQuery}
      />
      <PageContent>
        <div className="grid items-start gap-3 sm:gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
            <ConnectionsCard query={query} />
            <PrivacyCard />
          </div>
          <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
            <ExportCard />
            <ImportCard />
          </div>
        </div>
      </PageContent>
    </>
  )
}
