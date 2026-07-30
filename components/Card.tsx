"use client";

import type { Card as CardModel } from "@/lib/cards";
import { Figure, figureLabel } from "./Figure";
import styles from "./Card.module.css";

type Props = {
  card: CardModel;
  disabled: boolean;
  mismatch: boolean;
  onFlip: (id: string) => void;
};

export function Card({ card, disabled, mismatch, onFlip }: Props) {
  const revealed = card.flipped || card.matched;
  const state = card.matched ? "matched" : card.flipped ? "flipped" : "hidden";
  const className = [
    styles.card,
    revealed && styles.flipped,
    card.matched && styles.matched,
    mismatch && card.flipped && !card.matched && styles.mismatch,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      data-testid="card"
      data-state={state}
      data-figure={revealed ? card.figure : ""}
      aria-label={revealed ? figureLabel(card.figure) : "Hidden card"}
      onClick={() => onFlip(card.id)}
    >
      <div className={styles.inner}>
        <div className={`${styles.face} ${styles.back}`} />
        <div className={`${styles.face} ${styles.front}`}>
          <Figure figure={card.figure} />
        </div>
      </div>
    </button>
  );
}
