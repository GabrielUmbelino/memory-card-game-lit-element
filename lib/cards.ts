export type FigureId = "bot" | "cat" | "ghost" | "rabbit" | "bird" | "fish";

export type Card = {
  id: string;
  figure: FigureId;
  flipped: boolean;
  matched: boolean;
};

export const FIGURES: FigureId[] = ["bot", "cat", "ghost", "rabbit", "bird", "fish"];

export const PAIR_COUNT = FIGURES.length;
export const DECK_SIZE = PAIR_COUNT * 2;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function toDeck(figures: FigureId[]): Card[] {
  return figures.map((figure, index) => ({
    id: `slot-${index}`,
    figure,
    flipped: false,
    matched: false,
  }));
}

/** Deterministic deck for the first paint, so server and client markup agree. */
export function orderedDeck(): Card[] {
  return toDeck([...FIGURES, ...FIGURES]);
}

/** A shuffled deck of six pairs. Ids track the board slot, not the figure. */
export function createDeck(): Card[] {
  return toDeck(shuffle([...FIGURES, ...FIGURES]));
}
