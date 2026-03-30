export type Persona = "prosecutor" | "defense" | "judge"

export interface TribunalMessage {
  persona: Persona
  step: number
  label: string
  text: string
}

export interface SavedTribunal {
  id: string
  caseText: string
  createdAt: string
  status: "in_progress" | "complete"
  messages: TribunalMessage[]
  verdict: string | null
}
