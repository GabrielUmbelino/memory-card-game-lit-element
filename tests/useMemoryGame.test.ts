import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FIGURES, type Card, type FigureId } from "@/lib/cards";
import { calculateScore } from "@/lib/scoring";
import { MISMATCH_MS, PREVIEW_MS, useMemoryGame } from "@/lib/useMemoryGame";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function startGame() {
  const view = renderHook(() => useMemoryGame());
  act(() => view.result.current.start());
  advance(PREVIEW_MS);
  return view;
}

function pairIds(cards: Card[], figure: FigureId): [string, string] {
  const [first, second] = cards.filter((card) => card.figure === figure);
  return [first.id, second.id];
}

function mismatchedIds(cards: Card[]): [string, string] {
  const [a] = pairIds(cards, FIGURES[0]);
  const [b] = pairIds(cards, FIGURES[1]);
  return [a, b];
}

describe("useMemoryGame", () => {
  it("starts idle with a face-down board that ignores clicks", () => {
    const { result } = renderHook(() => useMemoryGame());
    expect(result.current.status).toBe("idle");
    expect(result.current.cards).toHaveLength(12);
    expect(result.current.cards.some((card) => card.flipped)).toBe(false);

    act(() => result.current.flip(result.current.cards[0].id));
    expect(result.current.cards.some((card) => card.flipped)).toBe(false);
  });

  it("previews every card, then turns the board over and runs the clock", () => {
    const { result } = renderHook(() => useMemoryGame());
    act(() => result.current.start());
    expect(result.current.status).toBe("preview");
    expect(result.current.cards.every((card) => card.flipped)).toBe(true);

    advance(PREVIEW_MS);
    expect(result.current.status).toBe("playing");
    expect(result.current.cards.every((card) => !card.flipped)).toBe(true);

    advance(2_000);
    expect(result.current.elapsedMs).toBeGreaterThanOrEqual(2_000);
  });

  it("keeps a matching pair and grows the streak", () => {
    const { result } = startGame();
    const [first, second] = pairIds(result.current.cards, FIGURES[0]);

    act(() => result.current.flip(first));
    act(() => result.current.flip(second));

    expect(result.current.matchedPairs).toBe(1);
    expect(result.current.streak).toBe(1);
    expect(result.current.errors).toBe(0);
    expect(result.current.cards.filter((card) => card.matched)).toHaveLength(2);
  });

  it("turns a mismatch back over and counts an error", () => {
    const { result } = startGame();
    const [first, second] = mismatchedIds(result.current.cards);

    act(() => result.current.flip(first));
    act(() => result.current.flip(second));
    expect(result.current.isMismatch).toBe(true);
    expect(result.current.errors).toBe(0);

    advance(MISMATCH_MS);
    expect(result.current.cards.some((card) => card.flipped)).toBe(false);
    expect(result.current.errors).toBe(1);
    expect(result.current.streak).toBe(0);
    expect(result.current.matchedPairs).toBe(0);
  });

  it("locks the board while a mismatch resolves", () => {
    const { result } = startGame();
    const [first, second] = mismatchedIds(result.current.cards);
    const third = result.current.cards.find((card) => card.id !== first && card.id !== second)!.id;

    act(() => result.current.flip(first));
    act(() => result.current.flip(second));
    expect(result.current.locked).toBe(true);

    act(() => result.current.flip(third));
    expect(result.current.cards.filter((card) => card.flipped)).toHaveLength(2);
  });

  it("resets the streak after a mismatch and rebuilds it on the next match", () => {
    const { result } = startGame();
    const [a1, a2] = pairIds(result.current.cards, FIGURES[0]);
    act(() => result.current.flip(a1));
    act(() => result.current.flip(a2));
    expect(result.current.streak).toBe(1);

    const [b1] = pairIds(result.current.cards, FIGURES[1]);
    const [c1] = pairIds(result.current.cards, FIGURES[2]);
    act(() => result.current.flip(b1));
    act(() => result.current.flip(c1));
    advance(MISMATCH_MS);
    expect(result.current.streak).toBe(0);

    const [b1again, b2] = pairIds(result.current.cards, FIGURES[1]);
    act(() => result.current.flip(b1again));
    act(() => result.current.flip(b2));
    expect(result.current.streak).toBe(1);
    expect(result.current.errors).toBe(1);
  });

  it("wins once every pair is matched and scores time plus errors", () => {
    const { result } = startGame();

    for (const figure of FIGURES) {
      const [first, second] = pairIds(result.current.cards, figure);
      act(() => result.current.flip(first));
      act(() => result.current.flip(second));
      advance(1_000);
    }

    expect(result.current.status).toBe("won");
    expect(result.current.matchedPairs).toBe(6);
    expect(result.current.score).toBe(calculateScore(result.current.elapsedMs, 0));
    expect(result.current.locked).toBe(true);
  });

  it("deals a fresh board on replay", () => {
    const { result } = startGame();
    const before = result.current.cards.map((card) => card.figure).join();

    act(() => result.current.start());
    expect(result.current.status).toBe("preview");
    expect(result.current.errors).toBe(0);
    expect(result.current.elapsedMs).toBe(0);
    advance(PREVIEW_MS);
    expect(result.current.cards.every((card) => !card.flipped && !card.matched)).toBe(true);
    // A reshuffle is random, so only assert the board is a valid fresh deal.
    expect(result.current.cards.map((card) => card.figure).sort().join()).toBe(
      [...FIGURES, ...FIGURES].sort().join(),
    );
    expect(before.length).toBeGreaterThan(0);
  });
});
