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
      "This is your OPENING ARGUMENT. Set the stage, present your core thesis, and outline your main points.",
    maxTokens: 1024,
  },
  {
    persona: "defense",
    label: "Opening Argument",
    instruction:
      "This is your OPENING ARGUMENT. Present your core thesis in favor of the position and outline your main points.",
    maxTokens: 1024,
  },
  {
    persona: "prosecutor",
    label: "Rebuttal",
    instruction:
      "This is your REBUTTAL. Directly address and counter the defense's arguments. Expose weaknesses in their reasoning.",
    maxTokens: 1024,
  },
  {
    persona: "defense",
    label: "Rebuttal",
    instruction:
      "This is your REBUTTAL. Directly address and counter the prosecution's arguments. Reinforce your position.",
    maxTokens: 1024,
  },
  {
    persona: "prosecutor",
    label: "Closing Statement",
    instruction:
      "This is your CLOSING STATEMENT. Summarize your strongest points, address remaining counterarguments, and make your final appeal.",
    maxTokens: 1024,
  },
  {
    persona: "defense",
    label: "Closing Statement",
    instruction:
      "This is your CLOSING STATEMENT. Summarize your strongest points, address remaining counterarguments, and make your final appeal.",
    maxTokens: 1024,
  },
  {
    persona: "judge",
    label: "Verdict",
    instruction: "Deliver your verdict and detailed reasoning.",
    maxTokens: 1500,
  },
]
