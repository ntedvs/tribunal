import { Streamdown } from "streamdown"
import "streamdown/styles.css"
import type { Persona } from "~/lib/types"

const PERSONA_NAMES: Record<Persona, string> = {
  prosecutor: "Prosecution",
  defense: "Defense",
  judge: "The Court",
}

const PERSONA_COLORS: Record<Persona, string> = {
  prosecutor: "bg-prosecution",
  defense: "bg-defense",
  judge: "bg-judge",
}

const PERSONA_TEXT: Record<Persona, string> = {
  prosecutor: "text-prosecution",
  defense: "text-defense",
  judge: "text-judge",
}

interface Props {
  persona: Persona
  label: string
  text: string
  isStreaming?: boolean
}

export function MessageBubble({ persona, label, text, isStreaming }: Props) {
  return (
    <article className="py-6">
      <header className="mb-4 flex items-center gap-3">
        <span
          className={`inline-block h-2 w-2 rounded-full ${PERSONA_COLORS[persona]}`}
        />
        <span
          className={`text-[0.6875rem] font-semibold tracking-[0.12em] uppercase ${PERSONA_TEXT[persona]}`}
        >
          {PERSONA_NAMES[persona]}
        </span>
        <span className="text-[0.6875rem] tracking-wide text-ink-faint">
          &mdash;
        </span>
        <span className="text-[0.6875rem] tracking-wide text-ink-muted italic">
          {label}
        </span>
      </header>
      <div className="pl-5">
        <Streamdown
          animated={{ animation: "blurIn", duration: 150, sep: "word" }}
          isAnimating={isStreaming}
        >
          {text}
        </Streamdown>
      </div>
    </article>
  )
}
