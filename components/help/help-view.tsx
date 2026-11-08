"use client"

import { useMemo, useState } from "react"
import { PageContent } from "@/components/dashboard/app-shell"
import { PageHeader } from "@/components/dashboard/page-header"
import { ContactCard } from "@/components/help/contact-card"
import { FaqCard } from "@/components/help/faq-card"
import { ShortcutsCard } from "@/components/help/shortcuts-card"
import { TopicCards } from "@/components/help/topic-cards"
import { FAQS, HELP_TOPICS, type HelpTopicId } from "@/lib/data/help"

/** Help & Support — browse by topic, read the FAQ, or reach a person. */
export function HelpView() {
  const [query, setQuery] = useState("")
  const [topicId, setTopicId] = useState<HelpTopicId>()

  const topic = HELP_TOPICS.find((t) => t.id === topicId)

  const faqs = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FAQS.filter((faq) => {
      if (topicId && faq.topic !== topicId) return false
      if (!q) return true
      const label = HELP_TOPICS.find((t) => t.id === faq.topic)?.label ?? ""
      return [faq.question, faq.answer, label].some((v) => v.toLowerCase().includes(q))
    })
  }, [query, topicId])

  return (
    <>
      <PageHeader
        searchLabel="Search help"
        title="Help & Support"
        subtitle="Answers, shortcuts and a real person when you need one."
        query={query}
        onQueryChange={setQuery}
      />
      <PageContent>
        <TopicCards
          selectedId={topicId}
          onSelect={(id) => setTopicId((current) => (current === id ? undefined : id))}
        />
        <div className="grid items-start gap-3 sm:gap-4 xl:grid-cols-3">
          <FaqCard
            faqs={faqs}
            topic={topic}
            query={query.trim()}
            onClearTopic={() => setTopicId(undefined)}
            onClearQuery={() => setQuery("")}
            className="xl:col-span-2"
          />
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-1">
            <ContactCard />
            <ShortcutsCard />
          </div>
        </div>
      </PageContent>
    </>
  )
}
