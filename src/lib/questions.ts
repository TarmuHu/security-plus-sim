import type { Question } from "./types";
import mcq from "../../content/sy0-701/mcq.json";
import pbq from "../../content/sy0-701/pbq.json";

export const QUESTION_BANK: Question[] = [
  ...(mcq as Question[]),
  ...(pbq as Question[]),
];

export function getQuestionMap(): Map<string, Question> {
  return new Map(QUESTION_BANK.map((q) => [q.id, q]));
}

export function getQuestionsByIds(ids: string[]): Question[] {
  const map = getQuestionMap();
  return ids.map((id) => {
    const q = map.get(id);
    if (!q) throw new Error(`Missing question ${id}`);
    return q;
  });
}
