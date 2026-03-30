import { createFileRoute } from "@tanstack/react-router"
import { orchestrateJury } from "~/lib/orchestrate"
import type { TribunalMessage } from "~/lib/types"

export const Route = createFileRoute("/api/tribunal/jury")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json()
        const { caseText, messages, verdict } = body as {
          caseText: string
          messages: TribunalMessage[]
          verdict: string
        }

        if (!caseText || !messages || !verdict) {
          return new Response("Missing required fields", { status: 400 })
        }

        const debateHistory = messages
          .map(
            (m: TribunalMessage) =>
              `[${m.persona.toUpperCase()} — ${m.label}]:\n${m.text}`,
          )
          .join("\n\n")

        const encoder = new TextEncoder()
        const stream = new ReadableStream({
          async start(controller) {
            try {
              await orchestrateJury(
                caseText,
                debateHistory,
                verdict,
                ({ event, data }) => {
                  controller.enqueue(
                    encoder.encode(
                      `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
                    ),
                  )
                },
              )
            } catch (err) {
              controller.enqueue(
                encoder.encode(
                  `event: error\ndata: ${JSON.stringify({ message: String(err) })}\n\n`,
                ),
              )
            } finally {
              controller.close()
            }
          },
        })

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        })
      },
    },
  },
})
