import "dotenv/config"
import Anthropic from "@anthropic-ai/sdk"
import {
  SYSTEM_PROMPTS,
  JUROR_SYSTEM_PROMPT,
  JUROR_PERSONALITIES,
} from "./prompts"
import { ROUND_STEPS } from "./rounds"
import type { Persona, JurorVote } from "./types"

interface SSEEvent {
  event: string
  data: Record<string, unknown>
}

interface PriorMessage {
  persona: Persona
  label: string
  text: string
}

export async function orchestrateDebate(
  caseText: string,
  send: (evt: SSEEvent) => void,
  startStep: number = 0,
  priorHistory: PriorMessage[] = [],
) {
  const client = new Anthropic()
  const history: PriorMessage[] = [...priorHistory]

  for (let i = startStep; i < ROUND_STEPS.length; i++) {
    const step = ROUND_STEPS[i]
    const stepIndex = i + 1

    send({
      event: "step_start",
      data: { persona: step.persona, step: stepIndex, label: step.label },
    })

    const priorArgs = history
      .map((h) => `[${h.persona.toUpperCase()} — ${h.label}]:\n${h.text}`)
      .join("\n\n")

    const userContent = [
      `CASE: ${caseText}`,
      priorArgs ? `\nPRIOR ARGUMENTS:\n${priorArgs}` : "",
      `\n${step.instruction}`,
    ].join("\n")

    let fullText = ""

    const stream = client.messages.stream({
      model: "claude-sonnet-4-5",
      max_tokens: step.maxTokens,
      system: SYSTEM_PROMPTS[step.persona],
      messages: [{ role: "user", content: userContent }],
    })

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        fullText += event.delta.text
        send({
          event: "token",
          data: {
            persona: step.persona,
            text: event.delta.text,
            step: stepIndex,
          },
        })
      }
    }

    history.push({ persona: step.persona, label: step.label, text: fullText })

    send({
      event: "step_complete",
      data: {
        persona: step.persona,
        step: stepIndex,
        label: step.label,
        fullText,
      },
    })
  }

  send({ event: "done", data: {} })
}

function extractJurorVote(text: string): "FOR" | "AGAINST" {
  const match = text.match(/VOTE:\s*(FOR|AGAINST)/i)
  return match && match[1].toUpperCase() === "AGAINST" ? "AGAINST" : "FOR"
}

function cleanJurorText(text: string): string {
  return text.replace(/\n*VOTE:\s*(FOR|AGAINST)\s*$/i, "").trim()
}

export async function orchestrateJury(
  caseText: string,
  debateHistory: string,
  verdict: string,
  send: (evt: SSEEvent) => void,
) {
  const client = new Anthropic()

  send({ event: "jury_start", data: {} })

  const jurorPromises = Array.from({ length: 5 }, (_, i) => {
    const personality = JUROR_PERSONALITIES[i]
    const userContent = [
      `CASE: ${caseText}`,
      `\nDEBATE:\n${debateHistory}`,
      `\nJUDGE'S VERDICT: ${verdict}`,
      `\n${personality}`,
      `\nGive your reaction and vote.`,
    ].join("\n")

    return client.messages
      .create({
        model: "claude-haiku-4-5",
        max_tokens: 150,
        temperature: 0.95,
        system: JUROR_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userContent }],
      })
      .then((response) => {
        const raw =
          response.content[0].type === "text" ? response.content[0].text : ""
        const vote = extractJurorVote(raw)
        const text = cleanJurorText(raw)
        const juror: JurorVote = { jurorIndex: i, vote, text }
        send({ event: "juror_complete", data: { ...juror } })
        return juror
      })
      .catch(() => {
        const juror: JurorVote = {
          jurorIndex: i,
          vote: "FOR",
          text: "The juror abstained.",
        }
        send({ event: "juror_complete", data: { ...juror } })
        return juror
      })
  })

  const results = await Promise.all(jurorPromises)
  const tally = {
    for: results.filter((r) => r.vote === "FOR").length,
    against: results.filter((r) => r.vote === "AGAINST").length,
  }
  send({ event: "jury_done", data: { votes: results, tally } })
}
