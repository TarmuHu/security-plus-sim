import type { DomainId } from "./types";

export interface NotebookEntry {
  questionId: string;
  domain: DomainId;
  objective: string;
  misses: number;
  lastMissedAt: number;
  lastCredit: number;
}

export interface WrongNotebook {
  updatedAt: number;
  entries: Record<string, NotebookEntry>;
}

const NOTEBOOK_KEY = "sy0701_wrong_notebook";

export function loadNotebook(): WrongNotebook {
  if (typeof window === "undefined") {
    return { updatedAt: 0, entries: {} };
  }
  const raw = localStorage.getItem(NOTEBOOK_KEY);
  if (!raw) return { updatedAt: 0, entries: {} };
  try {
    return JSON.parse(raw) as WrongNotebook;
  } catch {
    return { updatedAt: 0, entries: {} };
  }
}

export function saveNotebook(nb: WrongNotebook): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(nb));
}

export function recordMisses(
  items: {
    questionId: string;
    domain: DomainId;
    objective: string;
    credit: number;
  }[]
): WrongNotebook {
  const nb = loadNotebook();
  const now = Date.now();
  for (const item of items) {
    if (item.credit >= 0.999) {
      // Fully correct — remove from notebook if present
      delete nb.entries[item.questionId];
      continue;
    }
    const prev = nb.entries[item.questionId];
    nb.entries[item.questionId] = {
      questionId: item.questionId,
      domain: item.domain,
      objective: item.objective,
      misses: (prev?.misses ?? 0) + 1,
      lastMissedAt: now,
      lastCredit: item.credit,
    };
  }
  nb.updatedAt = now;
  saveNotebook(nb);
  return nb;
}

export function clearNotebook(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(NOTEBOOK_KEY);
}

export function notebookIds(nb?: WrongNotebook): string[] {
  const book = nb ?? loadNotebook();
  return Object.values(book.entries)
    .sort((a, b) => b.misses - a.misses || b.lastMissedAt - a.lastMissedAt)
    .map((e) => e.questionId);
}
