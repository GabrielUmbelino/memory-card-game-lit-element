"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, createDeck, orderedDeck } from "./cards";
import { calculateScore } from "./scoring";

export const PREVIEW_MS = 3_000;
export const MISMATCH_MS = 900;
const TICK_MS = 100;

export type GameStatus = "idle" | "preview" | "playing" | "won";

export function useMemoryGame() {
  const [cards, setCards] = useState<Card[]>(orderedDeck);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [errors, setErrors] = useState(0);
  const [streak, setStreak] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAt = useRef(0);

  const start = useCallback(() => {
    setCards(createDeck().map((card) => ({ ...card, flipped: true })));
    setErrors(0);
    setStreak(0);
    setElapsedMs(0);
    setStatus("preview");
  }, []);

  // Memorisation window, then the board turns over and the clock starts.
  useEffect(() => {
    if (status !== "preview") return;
    const timer = setTimeout(() => {
      setCards((prev) => prev.map((card) => ({ ...card, flipped: false })));
      startedAt.current = Date.now();
      setStatus("playing");
    }, PREVIEW_MS);
    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status !== "playing") return;
    const ticker = setInterval(() => setElapsedMs(Date.now() - startedAt.current), TICK_MS);
    return () => clearInterval(ticker);
  }, [status]);

  // A pair only stays open when it is wrong: matches are resolved on the click.
  const open = cards.filter((card) => card.flipped && !card.matched);
  const isMismatch = open.length === 2;

  useEffect(() => {
    if (!isMismatch) return;
    const timer = setTimeout(() => {
      setCards((prev) => prev.map((card) => (card.matched ? card : { ...card, flipped: false })));
      setErrors((value) => value + 1);
      setStreak(0);
    }, MISMATCH_MS);
    return () => clearTimeout(timer);
  }, [isMismatch]);

  const flip = useCallback(
    (id: string) => {
      if (status !== "playing") return;
      const card = cards.find((item) => item.id === id);
      if (!card || card.flipped || card.matched || open.length >= 2) return;

      const [pending] = open;
      if (!pending || pending.figure !== card.figure) {
        setCards(cards.map((item) => (item.id === id ? { ...item, flipped: true } : item)));
        return;
      }

      const matched = new Set([id, pending.id]);
      const next = cards.map((item) =>
        matched.has(item.id) ? { ...item, flipped: true, matched: true } : item,
      );
      setCards(next);
      setStreak((value) => value + 1);

      if (next.every((item) => item.matched)) {
        setElapsedMs(Date.now() - startedAt.current);
        setStatus("won");
      }
    },
    [cards, open, status],
  );

  const matchedPairs = cards.filter((card) => card.matched).length / 2;

  return {
    cards,
    status,
    errors,
    streak,
    elapsedMs,
    matchedPairs,
    score: calculateScore(elapsedMs, errors),
    isMismatch,
    locked: status !== "playing" || isMismatch,
    start,
    flip,
  };
}
