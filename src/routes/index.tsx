import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { CaseForm } from "~/components/CaseForm"
import { PastTribunals } from "~/components/PastTribunals"
import { listTribunals, saveTribunal } from "~/lib/storage"
import type { SavedTribunal } from "~/lib/types"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  const navigate = useNavigate()
  const [past, setPast] = useState<SavedTribunal[]>([])

  useEffect(() => {
    setPast(listTribunals())
  }, [])

  function handleSubmit(caseText: string) {
    const id = crypto.randomUUID()
    saveTribunal({
      id,
      caseText,
      createdAt: new Date().toISOString(),
      status: "in_progress",
      messages: [],
      verdict: null,
    })
    navigate({ to: "/tribunal/$id", params: { id } })
  }

  return (
    <div className="space-y-20">
      <CaseForm onSubmit={handleSubmit} />
      <PastTribunals tribunals={past} />
    </div>
  )
}
