import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect, useCallback, useRef } from "react"
import { DebateView } from "~/components/DebateView"
import { loadTribunal, saveTribunal, extractVerdict } from "~/lib/storage"
import type { Persona, TribunalMessage } from "~/lib/types"

export const Route = createFileRoute("/tribunal/$id")({
  component: TribunalPage,
})

function TribunalPage() {
  const { id } = Route.useParams()
  const [caseText, setCaseText] = useState("")
  const [messages, setMessages] = useState<TribunalMessage[]>([])
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null)
  const [currentLabel, setCurrentLabel] = useState("")
  const [currentText, setCurrentText] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [verdict, setVerdict] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const saveProgress = useCallback(
    (msgs: TribunalMessage[], v: string | null, done: boolean) => {
      const saved = loadTribunal(id)
      if (!saved) return
      saveTribunal({
        ...saved,
        messages: msgs,
        verdict: v,
        status: done ? "complete" : "in_progress",
      })
    },
    [id],
  )

  const startDebate = useCallback(
    (text: string, startStep: number, prior: TribunalMessage[]) => {
      setIsStreaming(true)
      const controller = new AbortController()
      abortRef.current = controller

      const priorHistory = prior.map((m) => ({
        persona: m.persona,
        label: m.label,
        text: m.text,
      }))

      fetch("/api/tribunal/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseText: text,
          startStep,
          priorHistory,
        }),
        signal: controller.signal,
      })
        .then(async (response) => {
          const reader = response.body!.getReader()
          const decoder = new TextDecoder()
          let buffer = ""

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            const parts = buffer.split("\n\n")
            buffer = parts.pop()!

            for (const part of parts) {
              if (!part.trim()) continue
              const lines = part.split("\n")
              let eventName = ""
              let eventData = ""
              for (const line of lines) {
                if (line.startsWith("event: ")) eventName = line.slice(7)
                if (line.startsWith("data: ")) eventData = line.slice(6)
              }
              if (!eventName || !eventData) continue

              const data = JSON.parse(eventData)

              if (eventName === "step_start") {
                setCurrentPersona(data.persona)
                setCurrentLabel(data.label)
                setCurrentText("")
              } else if (eventName === "token") {
                setCurrentText((prev) => prev + data.text)
              } else if (eventName === "step_complete") {
                const msg: TribunalMessage = {
                  persona: data.persona,
                  step: data.step,
                  label: data.label,
                  text: data.fullText,
                }
                setMessages((prev) => {
                  const next = [...prev, msg]
                  const v =
                    data.persona === "judge"
                      ? extractVerdict(data.fullText)
                      : null
                  if (v) setVerdict(v)
                  saveProgress(next, v, false)
                  return next
                })
                setCurrentText("")
                setCurrentPersona(null)
              } else if (eventName === "done") {
                setIsStreaming(false)
                setIsDone(true)
              } else if (eventName === "error") {
                setError(data.message)
                setIsStreaming(false)
                setIsDone(true)
              }
            }
          }

          // stream ended without explicit done (e.g. connection drop)
          setIsStreaming((s) => {
            if (s) setIsDone(true)
            return false
          })
        })
        .catch((err) => {
          if (err.name === "AbortError") return
          setError("Connection lost. The debate may have ended unexpectedly.")
          setIsStreaming(false)
          setIsDone(true)
        })

      return controller
    },
    [saveProgress],
  )

  useEffect(() => {
    const saved = loadTribunal(id)
    setLoaded(true)
    if (!saved) return

    setCaseText(saved.caseText)

    if (saved.status === "complete") {
      setMessages(saved.messages)
      setVerdict(saved.verdict)
      setIsDone(true)
      return
    }

    // Resume from saved progress
    const resumeMessages = saved.messages || []
    setMessages(resumeMessages)
    if (resumeMessages.length > 0) {
      const lastJudge = resumeMessages.find((m) => m.persona === "judge")
      if (lastJudge) setVerdict(extractVerdict(lastJudge.text))
    }

    const controller = startDebate(
      saved.caseText,
      resumeMessages.length,
      resumeMessages,
    )
    return () => controller.abort()
  }, [id, startDebate])

  useEffect(() => {
    if (!isDone || !caseText || messages.length === 0) return
    saveProgress(messages, verdict, true)
  }, [isDone, caseText, messages, verdict, saveProgress])

  if (!loaded) {
    return null
  }

  if (!caseText) {
    return <p className="pt-12 text-center text-ink-muted">Case not found.</p>
  }

  return (
    <div className="mx-auto max-w-6xl pt-8">
      <div className="mb-2">
        <span className="text-[0.6875rem] font-medium tracking-[0.15em] text-ink-muted uppercase">
          Case Before the Tribunal
        </span>
      </div>
      <h1 className="font-serif text-3xl leading-snug font-medium tracking-tight md:text-4xl">
        {caseText}
      </h1>

      {error && (
        <p className="mt-6 text-[0.8125rem] text-prosecution">{error}</p>
      )}

      <DebateView
        messages={messages}
        currentPersona={currentPersona}
        currentLabel={currentLabel}
        currentText={currentText}
        isStreaming={isStreaming}
        isDone={isDone}
        verdict={verdict}
      />
    </div>
  )
}
