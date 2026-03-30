import { Streamdown } from "streamdown"
import "streamdown/styles.css"

interface Props {
  text: string
  verdict: string | null
  isStreaming?: boolean
}

export function VerdictCard({ text, verdict, isStreaming }: Props) {
  return (
    <article className="mt-4 border border-border bg-surface-raised p-8">
      <header className="mb-1 flex items-center gap-3">
        <span className="inline-block h-2 w-2 rounded-full bg-judge" />
        <span className="text-[0.6875rem] font-semibold tracking-[0.12em] text-judge uppercase">
          The Court's Verdict
        </span>
      </header>
      {verdict && !isStreaming && (
        <p className="mt-5 mb-4 font-serif text-2xl font-semibold tracking-tight">
          {verdict}
        </p>
      )}
      <div className="mt-4">
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
