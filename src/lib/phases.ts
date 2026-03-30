import { ROUND_STEPS } from "./rounds"
import type { TribunalMessage } from "./types"

export interface Phase {
  id: string
  label: string
  stepIndices: number[]
  type: "paired" | "solo"
}

export const PHASES: Phase[] = [
  {
    id: "opening",
    label: "Opening Arguments",
    stepIndices: [0, 1],
    type: "paired",
  },
  { id: "rebuttal", label: "Rebuttals", stepIndices: [2, 3], type: "paired" },
  {
    id: "closing",
    label: "Closing Statements",
    stepIndices: [4, 5],
    type: "paired",
  },
  { id: "verdict", label: "Verdict", stepIndices: [6], type: "solo" },
]

export interface PhaseMessages {
  left: TribunalMessage | null
  right: TribunalMessage | null
}

export function groupMessagesIntoPhases(
  messages: TribunalMessage[],
): PhaseMessages[] {
  return PHASES.map((phase) => {
    const left =
      messages.find((m) => m.step - 1 === phase.stepIndices[0]) ?? null
    const right =
      phase.stepIndices.length > 1
        ? (messages.find((m) => m.step - 1 === phase.stepIndices[1]) ?? null)
        : null
    return { left, right }
  })
}

export function getPhaseIndexForStep(stepIndex: number): number {
  return PHASES.findIndex((p) => p.stepIndices.includes(stepIndex))
}

export function getSlotForStep(stepIndex: number): "left" | "right" | "full" {
  const step = ROUND_STEPS[stepIndex]
  if (step.persona === "judge") return "full"
  if (step.persona === "prosecutor") return "left"
  return "right"
}
