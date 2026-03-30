import type { Phase } from "~/lib/phases"
import type { Persona, TribunalMessage } from "~/lib/types"
import { MessageBubble } from "./MessageBubble"
import { ThinkingIndicator } from "./ThinkingIndicator"

interface Props {
  phase: Phase
  leftMessage: TribunalMessage | null
  rightMessage: TribunalMessage | null
  streamingSlot: "left" | "right" | null
  streamingPersona: Persona | null
  streamingLabel: string
  streamingText: string
  isThinking: boolean
}

function AwaitingPlaceholder({ side }: { side: "defense" | "prosecution" }) {
  return (
    <div className="flex items-center justify-center py-12 text-[0.8125rem] text-ink-faint italic">
      Awaiting {side === "defense" ? "defense" : "prosecution"}&hellip;
    </div>
  )
}

export function PhaseRow({
  phase,
  leftMessage,
  rightMessage,
  streamingSlot,
  streamingPersona,
  streamingLabel,
  streamingText,
  isThinking,
}: Props) {
  const hasLeft = leftMessage || streamingSlot === "left"
  const hasRight = rightMessage || streamingSlot === "right"
  if (!hasLeft && !hasRight) return null

  return (
    <section id={`phase-${phase.id}`} className="scroll-mt-20">
      <h3 className="mb-4 text-[0.6875rem] font-medium tracking-[0.15em] text-ink-muted uppercase">
        {phase.label}
      </h3>
      <div className="grid grid-cols-1 gap-x-10 gap-y-0 md:grid-cols-2">
        {/* Left: prosecution */}
        <div className="min-w-0">
          {leftMessage ? (
            <MessageBubble
              persona={leftMessage.persona}
              label={leftMessage.label}
              text={leftMessage.text}
            />
          ) : streamingSlot === "left" && streamingPersona ? (
            isThinking ? (
              <ThinkingIndicator persona={streamingPersona} />
            ) : (
              <MessageBubble
                persona={streamingPersona}
                label={streamingLabel}
                text={streamingText}
                isStreaming
              />
            )
          ) : null}
        </div>

        {/* Right: defense */}
        <div className="min-w-0">
          {rightMessage ? (
            <MessageBubble
              persona={rightMessage.persona}
              label={rightMessage.label}
              text={rightMessage.text}
            />
          ) : streamingSlot === "right" && streamingPersona ? (
            isThinking ? (
              <ThinkingIndicator persona={streamingPersona} />
            ) : (
              <MessageBubble
                persona={streamingPersona}
                label={streamingLabel}
                text={streamingText}
                isStreaming
              />
            )
          ) : hasLeft && !hasRight ? (
            <AwaitingPlaceholder side="defense" />
          ) : null}
        </div>
      </div>
    </section>
  )
}
