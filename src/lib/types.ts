export type Persona = "prosecutor" | "defense" | "judge"

export interface TribunalMessage {
  persona: Persona
  step: number
  label: string
  text: string
}

export interface JurorVote {
  jurorIndex: number
  vote: "FOR" | "AGAINST"
  text: string
}

export interface JuryResult {
  votes: JurorVote[]
  tally: { for: number; against: number }
}

export interface SavedTribunal {
  id: string
  caseText: string
  createdAt: string
  status: "in_progress" | "complete"
  messages: TribunalMessage[]
  verdict: string | null
  jury?: JuryResult | null
}
