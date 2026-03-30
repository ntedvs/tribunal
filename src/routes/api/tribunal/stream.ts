import { createFileRoute } from "@tanstack/react-router"
import { orchestrateDebate } from "~/lib/orchestrate"

export const Route = createFileRoute("/api/tribunal/stream")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json()
        const { caseText, startStep = 0, priorHistory = [] } = body

        if (!caseText) {
          return new Response("Missing caseText", { status: 400 })
        }

        const encoder = new TextEncoder()
        const stream = new ReadableStream({
          async start(controller) {
            try {
              await orchestrateDebate(
                caseText,
                ({ event, data }) => {
                  controller.enqueue(
                    encoder.encode(
                      `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
                    ),
                  )
                },
                startStep,
                priorHistory,
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
