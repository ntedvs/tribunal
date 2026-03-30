import type { SavedTribunal } from "~/lib/types"

interface Props {
  tribunals: SavedTribunal[]
}

export function PastTribunals({ tribunals }: Props) {
  if (tribunals.length === 0) return null

  return (
    <section className="border-t border-border pt-12">
      <h2 className="mb-8 text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-ink-muted">
        Past Cases
      </h2>
      <ul className="space-y-0 divide-y divide-border">
        {tribunals.map((t) => (
          <li key={t.id}>
            <a
              href={`/tribunal/${t.id}`}
              className="group flex items-baseline justify-between gap-6 py-5 no-underline transition-colors"
            >
              <span className="font-serif text-lg font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                {t.caseText}
              </span>
              <span className="flex shrink-0 items-center gap-4">
                {t.verdict && (
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                    {t.verdict}
                  </span>
                )}
                <span className="text-[0.6875rem] tracking-wide text-ink-faint">
                  {new Date(t.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                  {t.status === "in_progress" && (
                    <span className="ml-2 text-accent">In progress</span>
                  )}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
