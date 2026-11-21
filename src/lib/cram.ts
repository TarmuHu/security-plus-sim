import type { CramBank, CramCard, CramPack } from "./cram-types";
import raw from "../../content/sy0-701/cram-packs.json";

export const CRAM_BANK = raw as CramBank;

export function getPacks(): CramPack[] {
  return CRAM_BANK.packs;
}

export function getPack(id: string): CramPack | undefined {
  return CRAM_BANK.packs.find((p) => p.id === id);
}

export function getCardsForPack(pack: CramPack): CramCard[] {
  const map = new Map(CRAM_BANK.cards.map((c) => [c.id, c]));
  return pack.cardIds
    .map((id) => map.get(id))
    .filter((c): c is CramCard => !!c)
    .sort((a, b) => b.frequency - a.frequency);
}

export function hitLabel(hit: CramCard["hit"]): string {
  if (hit === "critical") return "CRITICAL HIT";
  if (hit === "high") return "HIGH HIT";
  return "MEDIUM";
}
