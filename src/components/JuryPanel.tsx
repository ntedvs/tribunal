import { Streamdown } from "streamdown"
import "streamdown/styles.css"
import type { JurorVote } from "~/lib/types"

const JUROR_COLORS = ["#6b5b73", "#5b7065", "#7a6550", "#506b7a", "#6b6b50"]

interface Props {
  votes: JurorVote[]
  isPolling: boolean
  isDone: boolean
  verdict: string | null
  onPollJury: () => void
  showButton: boolean
}

export function JuryPanel({
  votes,
  isPolling,
  isDone,
  verdict,
  onPollJury,
  showButton,
}: Props) {
  const forCount = votes.filter((v) => v.vote === "FOR").length
  const againstCount = votes.filter((v) => v.vote === "AGAINST").length

  return (
    <section id="phase-jury" className="scroll-mt-20 mt-10">
      <h3 className="mb-4 text-[0.6875rem] font-medium tracking-[0.15em] text-ink-muted uppercase">
        Jury Deliberation
      </h3>

      {showButton && (
        <button
          onClick={onPollJury}
          className="border border-border bg-surface-raised px-6 py-3 text-[0.8125rem] font-semibold tracking-[0.1em] text-ink uppercase transition-colors hover:bg-accent-light hover:border-accent"
        >
          Poll the Jury
        </button>
      )}

      {isPolling && votes.length === 0 && (
        <div className="flex items-center gap-2 py-6 text-[0.8125rem] text-ink-muted">
          <span>The jury is deliberating</span>
          <span className="flex gap-0.5">
            <span className="thinking-dot inline-block h-1 w-1 rounded-full bg-ink-muted" />
            <span className="thinking-dot inline-block h-1 w-1 rounded-full bg-ink-muted" />
            <span className="thinking-dot inline-block h-1 w-1 rounded-full bg-ink-muted" />
          </span>
        </div>
      )}

      {votes.length > 0 && (
        <>
          {/* Live tally */}
          <div className="mb-6 flex items-baseline gap-3">
            <span className="text-[0.8125rem] font-semibold tracking-[0.08em] text-defense uppercase">
              {forCount} For
            </span>
            <span className="text-ink-faint">/</span>
            <span className="text-[0.8125rem] font-semibold tracking-[0.08em] text-prosecution uppercase">
              {againstCount} Against
            </span>
            {isDone && (
              <span className="ml-2 font-serif text-lg font-semibold tracking-tight text-ink">
                {forCount > againstCount
                  ? "-- Jury sides with the defense"
                  : againstCount > forCount
                    ? "-- Jury sides with the prosecution"
                    : "-- Jury is split"}
              </span>
            )}
          </div>

          {/* Juror cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {votes
              .sort((a, b) => a.jurorIndex - b.jurorIndex)
              .map((juror) => (
                <article
                  key={juror.jurorIndex}
                  className="animate-jury-enter border border-border bg-surface-raised p-4"
                  style={{
                    animationDelay: `${juror.jurorIndex * 0.1}s`,
                  }}
                >
                  <header className="mb-2 flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: JUROR_COLORS[juror.jurorIndex],
                      }}
                    />
                    <span
                      className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase"
                      style={{ color: JUROR_COLORS[juror.jurorIndex] }}
                    >
                      Juror #{juror.jurorIndex + 1}
                    </span>
                  </header>
                  <div className="mb-3">
                    <Streamdown isAnimating={false}>
                      {juror.text}
                    </Streamdown>
                  </div>
                  <span
                    className={`inline-block text-[0.6875rem] font-semibold tracking-[0.1em] uppercase ${
                      juror.vote === "FOR" ? "text-defense" : "text-prosecution"
                    }`}
                  >
                    {juror.vote === "FOR"
                      ? "For the defense"
                      : "For the prosecution"}
                  </span>
                </article>
              ))}
          </div>
        </>
      )}
    </section>
  )
}
