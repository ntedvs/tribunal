import { PHASES } from "~/lib/phases"

interface Props {
  completedSteps: number
  activeStepIndex: number | null
}

function getPhaseState(
  phase: (typeof PHASES)[number],
  completedSteps: number,
  activeStepIndex: number | null,
): "completed" | "active" | "pending" {
  const allDone = phase.stepIndices.every((i) => i < completedSteps)
  if (allDone) return "completed"
  const isActive =
    activeStepIndex !== null && phase.stepIndices.includes(activeStepIndex)
  if (isActive) return "active"
  return "pending"
}

export function StageTimeline({ completedSteps, activeStepIndex }: Props) {
  return (
    <nav className="sticky top-0 z-10 -mx-4 flex items-center gap-1 bg-surface/95 px-4 py-4 backdrop-blur-sm md:gap-2">
      {PHASES.map((phase, i) => {
        const state = getPhaseState(phase, completedSteps, activeStepIndex)

        return (
          <button
            key={phase.id}
            type="button"
            onClick={() =>
              document
                .getElementById(`phase-${phase.id}`)
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className={`group flex flex-1 cursor-pointer flex-col items-center gap-2 ${
              state === "pending" ? "opacity-40" : ""
            }`}
          >
            <div className="flex w-full items-center gap-1 md:gap-2">
              <div
                className={`h-px flex-1 ${
                  state === "completed" || state === "active"
                    ? "bg-ink-muted"
                    : "bg-border"
                }`}
              />
              <div
                className={`h-2.5 w-2.5 shrink-0 rounded-full transition-all ${
                  state === "completed"
                    ? "bg-ink"
                    : state === "active"
                      ? "animate-pulse bg-ink"
                      : "border border-border bg-transparent"
                }`}
              />
              <div
                className={`h-px flex-1 ${
                  state === "completed" ? "bg-ink-muted" : "bg-border"
                }`}
              />
            </div>
            <span
              className={`text-[0.6rem] font-medium tracking-[0.1em] uppercase transition-colors md:text-[0.65rem] ${
                state === "completed"
                  ? "text-ink"
                  : state === "active"
                    ? "text-ink"
                    : "text-ink-faint"
              } group-hover:text-ink`}
            >
              {phase.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
