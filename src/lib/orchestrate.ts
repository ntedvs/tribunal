import "dotenv/config"
import Anthropic from "@anthropic-ai/sdk"
import { SYSTEM_PROMPTS } from "./prompts"
import { ROUND_STEPS } from "./rounds"
import type { Persona } from "./types"

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
      model: "claude-sonnet-4-5-20250929",
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
