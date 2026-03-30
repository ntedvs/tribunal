import { useEffect, useRef } from "react"
import type { Persona, TribunalMessage } from "~/lib/types"
import { MessageBubble } from "./MessageBubble"
import { ThinkingIndicator } from "./ThinkingIndicator"
import { VerdictCard } from "./VerdictCard"

interface Props {
  messages: TribunalMessage[]
  currentPersona: Persona | null
  currentLabel: string
  currentText: string
  isStreaming: boolean
  isDone: boolean
  verdict: string | null
}

function isNearBottom(threshold = 80) {
  return (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - threshold
  )
}

export function DebateView({
  messages,
  currentPersona,
  currentLabel,
  currentText,
  isStreaming,
  isDone,
  verdict,
}: Props) {
  const following = useRef(true)
  const touchY = useRef(0)
  const userScrolled = useRef(false)

  // Reset follow state when a new stream begins
  useEffect(() => {
    if (isStreaming) following.current = true
  }, [isStreaming])

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        following.current = false
        userScrolled.current = true
      }
    }
    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0].clientY > touchY.current) {
        following.current = false
        userScrolled.current = true
      }
    }
    const onScroll = () => {
      // Only let user-initiated scrolls re-enable following.
      // Ignore scroll events fired by programmatic scrollIntoView.
      if (!userScrolled.current) return
      userScrolled.current = false
      if (isNearBottom()) following.current = true
    }

    window.addEventListener("wheel", onWheel, { passive: true })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  useEffect(() => {
    if (!isStreaming || !following.current) return
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    })
  }, [isStreaming, currentText, messages.length])

  return (
    <div className="mt-8 space-y-0">
      {messages.map((msg, i) =>
        msg.persona === "judge" ? (
          <VerdictCard key={i} text={msg.text} verdict={verdict} />
        ) : (
          <MessageBubble
            key={i}
            persona={msg.persona}
            label={msg.label}
            text={msg.text}
          />
        ),
      )}

      {isStreaming &&
        currentPersona &&
        currentText &&
        (currentPersona === "judge" ? (
          <VerdictCard text={currentText} verdict={null} isStreaming />
        ) : (
          <MessageBubble
            persona={currentPersona}
            label={currentLabel}
            text={currentText}
            isStreaming
          />
        ))}

      {isStreaming && currentPersona && !currentText && (
        <ThinkingIndicator persona={currentPersona} />
      )}

      {isDone && !verdict && messages.length > 0 && (
        <p className="border-t border-border pt-8 text-center text-[0.8125rem] text-ink-muted">
          Debate complete.
        </p>
      )}
    </div>
  )
}
