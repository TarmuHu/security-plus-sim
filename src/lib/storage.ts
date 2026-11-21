import type { Attempt, ScoreReport } from "./types";

const ATTEMPT_KEY = "sy0701_active_attempt";
const REPORT_KEY = "sy0701_last_report";

export function saveAttempt(attempt: Attempt): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempt));
}

export function loadAttempt(): Attempt | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ATTEMPT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Attempt;
  } catch {
    return null;
  }
}

export function clearAttempt(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ATTEMPT_KEY);
}

export function saveReport(report: ScoreReport): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REPORT_KEY, JSON.stringify(report));
}

export function loadReport(): ScoreReport | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(REPORT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ScoreReport;
  } catch {
    return null;
  }
}
