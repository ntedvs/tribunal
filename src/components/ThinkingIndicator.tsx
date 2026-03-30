import type { Persona } from "~/lib/types"

const LABELS: Record<Persona, string> = {
  prosecutor: "Prosecution is preparing",
  defense: "Defense is preparing",
  judge: "The Court is deliberating",
}

const PERSONA_TEXT: Record<Persona, string> = {
  prosecutor: "text-prosecution",
  defense: "text-defense",
  judge: "text-judge",
}

export function ThinkingIndicator({ persona }: { persona: Persona }) {
  return (
    <div className="animate-fade-up flex items-center gap-3 border-t border-border py-8">
      <span
        className={`text-[0.6875rem] font-semibold tracking-[0.12em] uppercase ${PERSONA_TEXT[persona]}`}
      >
        {LABELS[persona]}
      </span>
      <span className="flex gap-1">
        <span className="thinking-dot inline-block h-1 w-1 rounded-full bg-ink-muted" />
        <span className="thinking-dot inline-block h-1 w-1 rounded-full bg-ink-muted" />
        <span className="thinking-dot inline-block h-1 w-1 rounded-full bg-ink-muted" />
      </span>
    </div>
  )
}
