export type CramHit = "critical" | "high" | "medium";

export interface CramCard {
  id: string;
  /** Estimated relative appearance / decision weight (1–100) from public outline analysis */
  frequency: number;
  hit: CramHit;
  domain: 1 | 2 | 3 | 4 | 5;
  objective: string;
  title: string;
  /** One-line “secret” / decision rule */
  secret: string;
  /** Common wrong-answer trap */
  trap: string;
  /** 20-second recall cue */
  recall: string;
  tags: string[];
}

export interface CramPack {
  id: string;
  version: string;
  title: string;
  subtitle: string;
  durationMin: number;
  focus: string;
  methodology: string;
  cardIds: string[];
}

export interface CramBank {
  generatedFrom: string;
  disclaimer: string;
  cards: CramCard[];
  packs: CramPack[];
}
