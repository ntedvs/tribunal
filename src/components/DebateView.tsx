import type { Persona, TribunalMessage } from "~/lib/types"
import { MessageBubble } from "./MessageBubble"
import { VerdictCard } from "./VerdictCard"
import { ThinkingIndicator } from "./ThinkingIndicator"

interface Props {
  messages: TribunalMessage[]
  currentPersona: Persona | null
  currentLabel: string
  currentText: string
  isStreaming: boolean
  isDone: boolean
  verdict: string | null
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
