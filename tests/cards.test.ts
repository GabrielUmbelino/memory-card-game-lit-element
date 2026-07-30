import { describe, expect, it } from "vitest";
import { DECK_SIZE, FIGURES, PAIR_COUNT, createDeck, orderedDeck } from "@/lib/cards";

describe("createDeck", () => {
  it("deals two of every figure, face down", () => {
    const deck = createDeck();
    expect(deck).toHaveLength(DECK_SIZE);
    expect(deck.every((card) => !card.flipped && !card.matched)).toBe(true);
    for (const figure of FIGURES) {
      expect(deck.filter((card) => card.figure === figure)).toHaveLength(2);
    }
  });

  it("gives every slot a unique id", () => {
    const deck = createDeck();
    expect(new Set(deck.map((card) => card.id)).size).toBe(DECK_SIZE);
  });

  it("shuffles between deals", () => {
    const layouts = new Set(
      Array.from({ length: 40 }, () => createDeck().map((card) => card.figure).join()),
    );
    expect(layouts.size).toBeGreaterThan(1);
  });
});

describe("orderedDeck", () => {
  it("is deterministic so the first paint hydrates cleanly", () => {
    expect(orderedDeck()).toEqual(orderedDeck());
    expect(orderedDeck()).toHaveLength(PAIR_COUNT * 2);
  });
});
