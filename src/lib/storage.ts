import type { SavedTribunal, TribunalMessage } from "./types"

const PREFIX = "tribunal:"

export function saveTribunal(tribunal: SavedTribunal) {
  localStorage.setItem(PREFIX + tribunal.id, JSON.stringify(tribunal))
}

export function loadTribunal(id: string): SavedTribunal | null {
  const raw = localStorage.getItem(PREFIX + id)
  return raw ? JSON.parse(raw) : null
}

export function listTribunals(): SavedTribunal[] {
  const results: SavedTribunal[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(PREFIX)) {
      try {
        results.push(JSON.parse(localStorage.getItem(key)!))
      } catch {}
    }
  }
  return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function extractVerdict(judgeText: string): string | null {
  const match = judgeText.match(
    /VERDICT:\s*\*?\*?\s*(FOR THE DEFENSE|FOR THE PROSECUTION|SPLIT DECISION)/i,
  )
  return match ? match[1].toUpperCase() : null
}
