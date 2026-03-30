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
        <h1 className="font-serif text-5xl leading-[1.1] font-medium tracking-tight md:text-6xl lg:text-7xl">
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
        className="w-full resize-none border-b border-border bg-transparent py-4 text-base leading-relaxed text-ink transition-colors outline-none placeholder:text-ink-faint focus:border-ink"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="border border-ink bg-ink px-6 py-3 text-[0.6875rem] font-medium tracking-[0.15em] text-surface uppercase transition-colors hover:bg-transparent hover:text-ink disabled:opacity-30 disabled:hover:bg-ink disabled:hover:text-surface"
      >
        Convene the Tribunal
      </button>
    </form>
  )
}
