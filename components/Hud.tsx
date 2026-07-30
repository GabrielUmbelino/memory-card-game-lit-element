"use client";

import { formatTime } from "@/lib/scoring";
import { PAIR_COUNT } from "@/lib/cards";
import styles from "./Hud.module.css";

type Props = {
  elapsedMs: number;
  errors: number;
  score: number;
  matchedPairs: number;
  streak: number;
};

export function Hud({ elapsedMs, errors, score, matchedPairs, streak }: Props) {
  return (
    <dl className={styles.hud}>
      <Stat label="time" value={formatTime(elapsedMs)} />
      <Stat label="pairs" value={`${matchedPairs}/${PAIR_COUNT}`} />
      <Stat label="errors" value={String(errors)} testId="errors" />
      <Stat
        label={streak > 1 ? `score · streak x${streak}` : "score"}
        value={score.toLocaleString("en-US")}
        testId="score"
        highlight
      />
    </dl>
  );
}

function Stat({
  label,
  value,
  testId,
  highlight,
}: {
  label: string;
  value: string;
  testId?: string;
  highlight?: boolean;
}) {
  return (
    <div className={styles.stat}>
      <dt className="eyebrow">{label}</dt>
      <dd
        className={`mono ${styles.value} ${highlight ? styles.highlight : ""}`}
        data-testid={testId}
      >
        {value}
      </dd>
    </div>
  );
}
