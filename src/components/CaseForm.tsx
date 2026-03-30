import { useState } from "react"

interface Props {
  onSubmit: (caseText: string) => void
}

export function CaseForm({ onSubmit }: Props) {
  const [text, setText] = useState("")

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (text.trim()) onSubmit(text.trim())
      }}
      className="space-y-8 pt-12"
    >
      <div className="space-y-3">
        <h1 className="font-serif text-5xl font-medium leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
          Present
          <br />
          Your Case
        </h1>
        <p className="max-w-md text-[0.8125rem] leading-relaxed text-ink-muted">
          Submit any debatable topic. The tribunal will hear arguments from both
          sides before rendering a verdict.
        </p>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. Pineapple belongs on pizza..."
        rows={3}
        className="w-full resize-none border-b border-border bg-transparent py-4 text-base leading-relaxed text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="group inline-flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-ink-muted transition-colors hover:text-ink disabled:opacity-30 disabled:hover:text-ink-muted"
      >
        Convene the Tribunal
        <span className="inline-block h-px w-10 bg-current transition-all group-hover:w-14" />
      </button>
    </form>
  )
}
