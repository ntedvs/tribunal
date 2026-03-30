import { useEffect, useRef } from "react"
import {
  PHASES,
  groupMessagesIntoPhases,
  getPhaseIndexForStep,
  getSlotForStep,
} from "~/lib/phases"
import type { Persona, TribunalMessage, JurorVote } from "~/lib/types"
import { JuryPanel } from "./JuryPanel"
import { PhaseRow } from "./PhaseRow"
import { StageTimeline } from "./StageTimeline"
import { ThinkingIndicator } from "./ThinkingIndicator"
import { VerdictCard } from "./VerdictCard"

interface Props {
  messages: TribunalMessage[]
  currentPersona: Persona | null
  currentLabel: string
  currentText: string
  isStreaming: boolean
  isDone: boolean
  verdict: string | null
  juryVotes: JurorVote[]
  isJuryPolling: boolean
  isJuryDone: boolean
  onPollJury: () => void
}

function isNearBottom(threshold = 80) {
  return (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - threshold
  )
}

export function DebateView({
  messages,
  currentPersona,
  currentLabel,
  currentText,
  isStreaming,
  isDone,
  verdict,
  juryVotes,
  isJuryPolling,
  isJuryDone,
  onPollJury,
}: Props) {
  const following = useRef(true)
  const touchY = useRef(0)
  const userScrolled = useRef(false)

  useEffect(() => {
    if (isStreaming || isJuryPolling) following.current = true
  }, [isStreaming, isJuryPolling])

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        following.current = false
        userScrolled.current = true
      }
    }
    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0].clientY > touchY.current) {
        following.current = false
        userScrolled.current = true
      }
    }
    const onScroll = () => {
      if (!userScrolled.current) return
      userScrolled.current = false
      if (isNearBottom()) following.current = true
    }

    window.addEventListener("wheel", onWheel, { passive: true })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  useEffect(() => {
    if ((!isStreaming && !isJuryPolling) || !following.current) return
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    })
  }, [isStreaming, isJuryPolling, currentText, messages.length, juryVotes.length])

  const phaseData = groupMessagesIntoPhases(messages)
  const currentStepIndex =
    isStreaming && currentPersona ? messages.length : null
  const activePhaseIndex =
    currentStepIndex !== null ? getPhaseIndexForStep(currentStepIndex) : null
  const activeSlot =
    currentStepIndex !== null ? getSlotForStep(currentStepIndex) : null

  return (
    <div className="mt-8">
      <StageTimeline
        completedSteps={messages.length}
        activeStepIndex={currentStepIndex}
      />

      <div className="mt-6 space-y-10">
        {PHASES.map((phase, phaseIdx) => {
          const { left, right } = phaseData[phaseIdx]
          const isActivePhase = phaseIdx === activePhaseIndex
          const hasContent = left || right || isActivePhase

          if (!hasContent) return null

          // Verdict phase
          if (phase.type === "solo") {
            const judgeMsg = left // judge message lands in "left" slot
            const isStreamingVerdict =
              isActivePhase && currentPersona === "judge"

            if (!judgeMsg && !isStreamingVerdict) return null

            return (
              <section
                key={phase.id}
                id={`phase-${phase.id}`}
                className="scroll-mt-20"
              >
                <h3 className="mb-4 text-[0.6875rem] font-medium tracking-[0.15em] text-ink-muted uppercase">
                  {phase.label}
                </h3>
                {judgeMsg ? (
                  <VerdictCard text={judgeMsg.text} verdict={verdict} />
                ) : isStreamingVerdict && currentText ? (
                  <VerdictCard text={currentText} verdict={null} isStreaming />
                ) : isStreamingVerdict ? (
                  <ThinkingIndicator persona="judge" />
                ) : null}
              </section>
            )
          }

          // Paired phase
          const streamingSlot = isActivePhase
            ? (activeSlot as "left" | "right")
            : null

          return (
            <PhaseRow
              key={phase.id}
              phase={phase}
              leftMessage={left}
              rightMessage={right}
              streamingSlot={streamingSlot}
              streamingPersona={isActivePhase ? currentPersona : null}
              streamingLabel={currentLabel}
              streamingText={currentText}
              isThinking={isActivePhase && !!currentPersona && !currentText}
            />
          )
        })}
      </div>

      {isDone && !verdict && messages.length > 0 && (
        <p className="pt-8 text-center text-[0.8125rem] text-ink-muted">
          Debate complete.
        </p>
      )}

      {isDone && verdict && (
        <JuryPanel
          votes={juryVotes}
          isPolling={isJuryPolling}
          isDone={isJuryDone}
          verdict={verdict}
          onPollJury={onPollJury}
          showButton={!isJuryPolling && juryVotes.length === 0}
        />
      )}
    </div>
  )
}
