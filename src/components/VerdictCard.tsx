import { Streamdown } from "streamdown"
import "streamdown/styles.css"

interface Props {
  text: string
  verdict: string | null
  isStreaming?: boolean
}

export function VerdictCard({ text, verdict, isStreaming }: Props) {
  return (
    <article className="animate-fade-up mt-4 border border-border bg-surface-raised p-8">
      <header className="mb-1 flex items-center gap-3">
        <span className="inline-block h-2 w-2 rounded-full bg-judge" />
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-judge">
          The Court's Verdict
        </span>
      </header>
      {verdict && !isStreaming && (
        <p className="mb-4 mt-5 font-serif text-2xl font-semibold tracking-tight">
          {verdict}
        </p>
      )}
      <div className="mt-4">
        <Streamdown
        animated={{ animation: "blurIn", duration: 200, sep: "word" }}
        caret="block"
        isAnimating={isStreaming}
      >
        {text}
      </Streamdown>
      </div>
    </article>
  )
}
