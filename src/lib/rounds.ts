import type { Persona } from "./types"

export interface RoundStep {
  persona: Persona
  label: string
  instruction: string
  maxTokens: number
}

export const ROUND_STEPS: RoundStep[] = [
  {
    persona: "prosecutor",
    label: "Opening Argument",
    instruction:
      "OPENING ARGUMENT. State your core thesis and top 2 points. Be brief.",
    maxTokens: 300,
  },
  {
    persona: "defense",
    label: "Opening Argument",
    instruction:
      "OPENING ARGUMENT. State your core thesis and top 2 points. Be brief.",
    maxTokens: 300,
  },
  {
    persona: "prosecutor",
    label: "Rebuttal",
    instruction:
      "REBUTTAL. Counter the defense's weakest point. One focused strike.",
    maxTokens: 250,
  },
  {
    persona: "defense",
    label: "Rebuttal",
    instruction:
      "REBUTTAL. Counter the prosecution's weakest point. One focused strike.",
    maxTokens: 250,
  },
  {
    persona: "prosecutor",
    label: "Closing Statement",
    instruction:
      "CLOSING STATEMENT. One paragraph, your single strongest argument.",
    maxTokens: 200,
  },
  {
    persona: "defense",
    label: "Closing Statement",
    instruction:
      "CLOSING STATEMENT. One paragraph, your single strongest argument.",
    maxTokens: 200,
  },
  {
    persona: "judge",
    label: "Verdict",
    instruction: "Deliver your verdict. Be concise and decisive.",
    maxTokens: 300,
  },
]
